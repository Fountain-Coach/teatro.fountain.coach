// Ear-owned, source-blind transcript witness. Requires macOS 26+.
import Foundation
import Speech
import AVFAudio
import CryptoKit

private struct TranscriptReceipt: Codable {
    let sourceId: String
    let audioSHA256: String
    let locale: String
    let recognitionEngine: String
    let modelAvailability: String
    let recognizedText: String
    let returnedSegments: Int
    let durationSeconds: Double
    let resultType: String
    let phonemeRecognition: String
    let publication: String
}
private struct TranscriptRun: Codable {
    let schema: String
    let status: String
    let results: [TranscriptReceipt]
}
private enum TranscriptError: Error, CustomStringConvertible {
    case invalid(String)
    var description: String {
        if case .invalid(let message) = self { return message }
        return "invalid request"
    }
}

@main struct EarPrivateTranscription {
    static func main() async {
        do {
            let args = Array(CommandLine.arguments.dropFirst())
            guard args.count >= 2, args[0] == "--locale" else {
                throw TranscriptError.invalid(
                    "usage: ear_private_transcript --locale en-US /tmp/source1.wav [/tmp/source2.wav ...]")
            }
            let requestedLocale = Locale(identifier: args[1])
            let normalizedLocale = requestedLocale.identifier.replacingOccurrences(of: "-", with: "_").lowercased()
            guard SpeechTranscriber.isAvailable else {
                throw TranscriptError.invalid("SpeechTranscriber is unavailable on this device")
            }
            let installed = await SpeechTranscriber.installedLocales
            guard let installedLocale = installed.first(where: {
                $0.identifier.replacingOccurrences(of: "-", with: "_").lowercased() == normalizedLocale
            }) else {
                throw TranscriptError.invalid(
                    "On-device recognition assets for " + requestedLocale.identifier +
                    " are not installed; no model download is allowed")
            }
            let localeCode = installedLocale.identifier
            let urls = args.dropFirst(2).map { URL(fileURLWithPath: $0).standardizedFileURL }
            guard !urls.isEmpty, urls.count <= 12 else {
                throw TranscriptError.invalid("Provide 1...12 private WAV inputs")
            }
            var receipts: [TranscriptReceipt] = []
            for url in urls {
                guard url.path.hasPrefix("/private/tmp/") || url.path.hasPrefix("/tmp/") else {
                    throw TranscriptError.invalid("Private analysis accepts only /tmp WAVs")
                }
                guard url.pathExtension.lowercased() == "wav" else {
                    throw TranscriptError.invalid("Only private WAV files are admitted")
                }
                let bytes = try Data(contentsOf: url)
                guard bytes.count >= 44, bytes.count < 20 * 1024 * 1024 else {
                    throw TranscriptError.invalid("Invalid / too large audio source " + url.lastPathComponent)
                }
                let digest = SHA256.hash(data: bytes).map { String(format: "%02x", $0) }.joined()
                let audio = try AVAudioFile(forReading: url)
                guard audio.length >= 0, audio.fileFormat.sampleRate > 0 else {
                    throw TranscriptError.invalid("Cannot read source duration")
                }
                let duration = Double(audio.length) / audio.fileFormat.sampleRate
                guard duration > 0, duration <= 30 else {
                    throw TranscriptError.invalid("Source outside bounded private duration")
                }
                let transcriber = SpeechTranscriber(locale: installedLocale, preset: .transcription)
                let analyzer = SpeechAnalyzer(modules: [transcriber])
                async let readResult = transcriber.results.reduce((AttributedString(), 0)) { previous, current in
                    var next = previous
                    next.0 += current.text
                    next.1 += 1
                    return next
                }
                if let end = try await analyzer.analyzeSequence(from: audio) {
                    try await analyzer.finalizeAndFinish(through: end)
                } else {
                    await analyzer.cancelAndFinishNow()
                }
                let (transcript, count) = try await readResult
                receipts.append(.init(
                    sourceId: url.lastPathComponent,
                    audioSHA256: digest,
                    locale: localeCode,
                    recognitionEngine: "Apple SpeechTranscriber (on-device, not Sing/Ear synthesis)",
                    modelAvailability: "already-installed; no model download",
                    recognizedText: String(transcript.characters).trimmingCharacters(in: .whitespacesAndNewlines),
                    returnedSegments: count,
                    durationSeconds: duration,
                    resultType: "independent-lexical-transcription",
                    phonemeRecognition: "NOT_IMPLEMENTED",
                    publication: "not-admitted"))
            }
            let report = TranscriptRun(schema:"ear.private-transcript.v1",
                                       status:"finished", results:receipts)
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
            print(String(decoding: try encoder.encode(report), as: UTF8.self))
        } catch {
            fputs("EAR_PRIVATE_TRANSCRIPT_FAILED " + String(describing: error) + "\n", stderr)
            exit(1)
        }
    }
}
