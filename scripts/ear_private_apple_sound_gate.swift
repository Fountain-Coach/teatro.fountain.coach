// Ear-owned private sound-event reference — NEVER a phoneme recognizer.
// Apple SoundAnalysis v1 model; source-blind input is WAV audio only.
// The caller's post-inference "candidate/negative" role is evaluation metadata.
// Native model is OS-owned: record exact OS version, do not claim SHA-pinning.
// No model download, voice training, publication, network or new service.
import Foundation
import SoundAnalysis
import CoreMedia
import CryptoKit

private let MIN_WINDOW_VOICE_SCORE = 0.50
private let MIN_ACTIVE_FRACTION = 0.50
private let MIN_WINDOWS = 2
private let VOICE_LABELS: Set<String> = ["speech", "singing", "humming"]

final class SoundObserver: NSObject, SNResultsObserving {
    var windows = 0
    var vocalWindows = 0
    var scores: [String: Double] = [:]
    var errors: [String] = []

    func request(_ request: SNRequest, didProduce result: SNResult) {
        guard let output = result as? SNClassificationResult else { return }
        windows += 1
        var topVoice = 0.0
        for item in output.classifications {
            let score = Double(item.confidence)
            guard score.isFinite, score >= 0 && score <= 1.0 else { continue }
            scores[item.identifier, default: 0] += score
            if VOICE_LABELS.contains(item.identifier) {
                topVoice = max(topVoice, score)
            }
        }
        if topVoice >= MIN_WINDOW_VOICE_SCORE {
            vocalWindows += 1
        }
    }

    func request(_ request: SNRequest, didFailWithError error: Error) {
        errors.append(String(describing: error))
    }
    func requestDidComplete(_ request: SNRequest) {}
}

func sha256Hex(_ data: Data) -> String {
    SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
}

func analyze(_ path: String) throws -> [String: Any] {
    let file = URL(fileURLWithPath: path).resolvingSymlinksInPath().standardizedFileURL
    // NSURL may preserve the /tmp alias instead of canonical /private/tmp
    // after resolving nested symlinks. Both are the same macOS private root.
    let underPrivateTmp = file.path.hasPrefix("/private/tmp/") || file.path.hasPrefix("/tmp/")
    guard underPrivateTmp, file.path.lowercased().hasSuffix(".wav") else {
        throw NSError(domain: "EarSourceBoundary", code: 1,
                      userInfo: [NSLocalizedDescriptionKey: "Private WAV under /tmp required"])
    }
    let bytes = try Data(contentsOf: file)
    guard bytes.count >= 44, bytes.count <= 14_000_000 else {
        throw NSError(domain: "EarSourceBoundary", code: 2,
                      userInfo: [NSLocalizedDescriptionKey: "Bounded WAV size required"])
    }
    let watcher = SoundObserver()
    let engine = try SNAudioFileAnalyzer(url: file)
    let request = try SNClassifySoundRequest(classifierIdentifier: .version1)
    request.windowDuration = CMTime(seconds: 1.0, preferredTimescale: 48_000)
    request.overlapFactor = 0.5
    try engine.add(request, withObserver: watcher)
    engine.analyze()
    guard watcher.errors.isEmpty else {
        throw NSError(domain: "EarSoundAnalysis", code: 3,
                      userInfo: [NSLocalizedDescriptionKey: watcher.errors.joined(separator: "; ")])
    }
    let fraction = watcher.windows > 0
        ? Double(watcher.vocalWindows) / Double(watcher.windows) : 0.0
    let pass = watcher.windows >= MIN_WINDOWS && fraction >= MIN_ACTIVE_FRACTION
    let labelAverages = watcher.scores.mapValues {
        Double((($0 / Double(max(watcher.windows, 1))) * 10000).rounded()) / 10000
    }
    return [
        "source": file.lastPathComponent,
        "sha256": sha256Hex(bytes),
        "windows": watcher.windows,
        "vocalEvidenceWindows": watcher.vocalWindows,
        "vocalEvidenceFraction": fraction,
        "topLabelsMean": Dictionary(uniqueKeysWithValues: labelAverages
            .sorted { $0.value > $1.value }.prefix(9).map { ($0.key, $0.value) }),
        "voiceEvidencePass": pass,
        "phoneSequenceRecognized": false,
        "calibratedVocalProbability": false,
        "humanIntelligibilityMeasured": false,
        "knownLimitation": "Music, humming and synthetic tones may be misclassified; scores are not calibrated",
    ]
}

var sources: [(String, String)] = []
var index = 1
let args = CommandLine.arguments
while index < args.count {
    let key = args[index]
    guard (key == "--candidate" || key == "--negative"), index + 1 < args.count else {
        fputs("Supply repeated --candidate/--negative private WAV paths\n", stderr)
        exit(2)
    }
    sources.append((key == "--negative" ? "negative" : "candidate", args[index + 1]))
    index += 2
}
guard !sources.isEmpty && sources.count <= 35 else {
    fputs("Expected one to 35 bounded private WAV references\n", stderr)
    exit(2)
}

var observations: [[String: Any]] = []
do {
    var known: Set<String> = []
    for (role, path) in sources {
        let file = URL(fileURLWithPath: path).resolvingSymlinksInPath().standardizedFileURL
        guard known.insert(file.path).inserted else {
            throw NSError(domain: "EarSourceBoundary", code: 4,
                          userInfo: [NSLocalizedDescriptionKey: "Duplicate private source"])
        }
        let raw = try analyze(path)
        observations.append(raw.merging(["expectedTestRole": role]) { old, _ in old })
    }
    let result: [String: Any] = [
        "schema": "ear.private-apple-sound-diagnostic.v1",
        "model": "Apple SoundAnalysis SNClassifierIdentifier.version1",
        "macOSBuild": ProcessInfo.processInfo.operatingSystemVersionString,
        "voiceLabels": Array(VOICE_LABELS).sorted(),
        "minimumWindowScore": MIN_WINDOW_VOICE_SCORE,
        "minimumEvidenceWindowFraction": MIN_ACTIVE_FRACTION,
        "minimumWindows": MIN_WINDOWS,
        "thresholdFrozenBeforeNovelWitness": true,
        "modelWeightsHashAvailable": false,
        "classEvidenceIsNotPhonemeConfidence": true,
        "noExpectedLyricsOrScoreAtInference": true,
        "observations": observations,
        "phonemeRecognitionQualified": false,
        "mediaPublished": false,
    ]
    let data = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
    print(String(decoding: data, as: UTF8.self))
} catch {
    fputs("Ear native sound diagnostic failed: \(error)\n", stderr)
    exit(3)
}
