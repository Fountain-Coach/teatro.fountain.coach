#!/usr/bin/env python3
"""One commanded local Ear witness: browser audio + lexical and envelope tests.

No cloud, no credentials, no MIDI host, no media publication. Tested macOS 26+
with Chrome, Swift, Python, Node. Private HTTP/CDP services are bound to
127.0.0.1 and terminated in finally. Output is receipt-only, never audio.
"""
from __future__ import annotations

import argparse
import json
import os
import platform
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

OWNER = Path(__file__).resolve().parents[1]
SCRIPTS = OWNER / "scripts"
CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def command(args: list[str], env=None, timeout=65) -> str:
    result = subprocess.run(args, check=True, capture_output=True,
                            text=True, timeout=timeout, env=env)
    return result.stdout


def private_path(filename: str) -> Path:
    resolved = Path(filename).expanduser().resolve()
    if not str(resolved).startswith("/private/tmp/"):
        raise ValueError("Private Ear audio and manifests must stay in /tmp")
    if not resolved.is_file():
        raise ValueError("Required private input does not exist")
    return resolved


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def wait_cdp(port: int):
    for _ in range(30):
        try:
            with urllib.request.urlopen(
                    f"http://127.0.0.1:{port}/json/version", timeout=0.5) as response:
                if json.load(response).get("Browser"):
                    return
        except (OSError, TimeoutError, ValueError):
            time.sleep(0.2)
    raise RuntimeError("Headless Chrome CDP not available on its private port")


def launch_browser(stage: Path, source_dir: Path):
    if not CHROME.is_file():
        raise RuntimeError("Google Chrome not installed; browser witness unavailable")
    http_port = free_port()
    cdp_port = free_port()
    with (stage / "http.log").open("wb") as http_log, (stage / "chrome.log").open("wb") as chrome_log:
        http = subprocess.Popen([
            sys.executable, "-m", "http.server", str(http_port),
            "--bind", "127.0.0.1", "--directory", str(source_dir)],
            stdout=http_log, stderr=subprocess.STDOUT, start_new_session=True)
        chrome = subprocess.Popen([
            str(CHROME), "--headless=new", "--no-first-run",
            "--no-default-browser-check", "--disable-gpu",
            "--autoplay-policy=no-user-gesture-required",
            "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream",
            f"--remote-debugging-port={cdp_port}", "--remote-allow-origins=*",
            f"--user-data-dir={stage / 'chrome-profile'}", "about:blank"],
            stdout=chrome_log, stderr=subprocess.STDOUT, start_new_session=True)
        try:
            wait_cdp(cdp_port)
            env = dict(os.environ)
            env.update({"EAR_HTTP_PORT": str(http_port), "EAR_CDP_PORT": str(cdp_port)})
            result = command(["node", str(SCRIPTS / "verify_speech_source_ear.mjs"),
                              str(source_dir)], env=env, timeout=55)
            return json.loads(result)
        finally:
            for process in (http, chrome):
                if process.poll() is None:
                    try:
                        os.killpg(process.pid, signal.SIGTERM)
                    except ProcessLookupError:
                        pass
                try:
                    process.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    try:
                        os.killpg(process.pid, signal.SIGKILL)
                    except ProcessLookupError:
                        pass


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--score", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--spoken", required=True)
    parser.add_argument("--procedural", required=True)
    parser.add_argument("--speech-derived", required=True)
    parser.add_argument("--receipt", default="/tmp/ear-private-speech-gate.json")
    parser.add_argument("--phonetic-reference")
    parser.add_argument("--novel-phonetic-witness")
    parser.add_argument("--human-reference")
    parser.add_argument("--human-asr")
    parser.add_argument("--human-challenge-reference")
    parser.add_argument("--human-challenge-asr")
    parser.add_argument("--human-sung-timing-reference")
    args = parser.parse_args()
    if bool(args.human_challenge_reference) != bool(args.human_challenge_asr):
        parser.error("Human mispronunciation challenge needs a source-blind ASR receipt")
    if bool(args.human_reference) != bool(args.human_asr):
        parser.error("Human reference requires a separate, blinded ASR receipt")
    if bool(args.phonetic_reference) != bool(args.novel_phonetic_witness):
        parser.error("Phonetic source requires separate NEW held-out voices too")
    if platform.system() != "Darwin":
        parser.error("The current source-blind transcript lane requires macOS 26+")
    paths = {name: private_path(value) for name, value in (
        ("manifest", args.manifest), ("spoken", args.spoken),
        ("procedural", args.procedural), ("speech-derived", args.speech_derived))}
    score = Path(args.score).expanduser().resolve()
    if not score.is_file():
        parser.error("Missing score")
    receipt = Path(args.receipt).expanduser().resolve()
    if not str(receipt).startswith("/private/tmp/"):
        parser.error("Receipt must be private, under /tmp")

    with tempfile.TemporaryDirectory(prefix="ear-source-blind-", dir="/tmp") as temporary:
        stage = Path(temporary)
        browser_dir = stage / "browser"
        command([sys.executable, str(SCRIPTS / "prepare_speech_source_ear.py"),
                 "--procedural", str(paths["procedural"]),
                 "--speech-derived", str(paths["speech-derived"]),
                 "--stage", str(browser_dir)])
        browser = launch_browser(stage, browser_dir)
        if browser["status"] != "passed":
            raise RuntimeError("Independent browser graph did not pass")
        command([sys.executable, str(SCRIPTS / "prepare_private_speech_negatives.py"),
                 "--prefix", str(stage / "ear-negative")])
        controls = [stage / ("ear-negative-" + name + ".wav") for name in
                    ("order", "consonant", "silence", "noise")]
        recognizer = stage / "ear-private-transcript"
        command(["swiftc", "-parse-as-library", str(SCRIPTS / "ear_private_transcript.swift"),
                 "-o", str(recognizer)], timeout=75)
        transcript = json.loads(command([
            str(recognizer), "--locale", "en-US",
            str(paths["spoken"]), str(paths["speech-derived"]),
            str(paths["procedural"]), *map(str, controls)], timeout=65))
        transcript_path = stage / "transcript.json"
        transcript_path.write_text(json.dumps(transcript))
        lexical = json.loads(command([
            sys.executable, str(SCRIPTS / "ear_private_lexical_gate.py"),
            str(transcript_path), "--source", paths["spoken"].name,
            "--candidate", paths["speech-derived"].name,
            "--procedural", paths["procedural"].name]))
        envelope = json.loads(command([
            sys.executable, str(SCRIPTS / "ear_private_envelope.py"),
            "--score", str(score), "--source-manifest", str(paths["manifest"]),
            "--spoken", str(paths["spoken"]),
            "--procedural", str(paths["procedural"]),
            "--speech-derived", str(paths["speech-derived"])]))
        phonetic_research = None
        if args.phonetic_reference:
            ref = private_path(args.phonetic_reference)
            novel = private_path(args.novel_phonetic_witness)
            cv = json.loads(command([
                sys.executable, str(SCRIPTS / "ear_private_cv_probe.py"),
                "--reference", str(ref),
                "--candidate", str(paths["speech-derived"]),
                "--report", str(stage / "bounded-cv.json")]))
            i_probe = json.loads(command([
                sys.executable, str(SCRIPTS / "ear_private_i_vowel_gate.py"),
                "--reference", str(ref),
                "--novel-witness", str(novel),
                "--candidate", str(paths["speech-derived"]),
                "--report", str(stage / "bounded-i.json")]))
            # Keep the complete model/test receipts private and preserve the
            # precise distance between a raw acoustic hypothesis and an
            # independently qualified phoneme recognizer.
            phonetic_research = {
                "cv": json.loads((stage / "bounded-cv.json").read_text()),
                "iNucleus": json.loads((stage / "bounded-i.json").read_text()),
                "scoreSuppliedToInference": False,
                "generalPhonemeRecognition": "NOT_QUALIFIED"
            }
            if (phonetic_research["iNucleus"]["independentPhonemeRecognition"] !=
                    "NOT_QUALIFIED"):
                raise RuntimeError("Bounded research erroneously claims phoneme recognition")
            match = phonetic_research["iNucleus"]["privateAudioWitness"]
            if len(match) != 1 or match[0]["SHA256"] != envelope["speechDerivedSHA256"]:
                raise RuntimeError("Phonetic and vowel detectors did not observe identical source")
        human_speech = None
        if args.human_reference:
            # Human-rated real speech is ONLY a separate independent reference.
            # It never provides labels or phonetic targets to the singing
            # renderer or acoustic/lexical inference.
            human_reference = private_path(args.human_reference)
            human_asr = private_path(args.human_asr)
            human_speech = json.loads(command([
                sys.executable,
                str(SCRIPTS / "ear_private_human_reference_gate.py"),
                "--reference", str(human_reference),
                "--asr", str(human_asr),
                "--report", str(stage / "human-speech-witness.json")
            ]))
            if human_speech["phonemeRecognition"] != "NOT_IMPLEMENTED":
                raise RuntimeError("Human speech word ASR cannot be called phone recognition")
        human_challenge = None
        if args.human_challenge_reference:
            challenge_manifest = private_path(args.human_challenge_reference)
            challenge_asr = private_path(args.human_challenge_asr)
            human_challenge = json.loads(command([
                sys.executable, str(SCRIPTS / "ear_private_human_reference_gate.py"),
                "--reference", str(challenge_manifest),
                "--asr", str(challenge_asr),
                "--report", str(stage / "human-pronunciation-challenge.json")
            ]))
            if (human_challenge["phonemeRecognition"] != "NOT_IMPLEMENTED" or
                    sum(k["recordings"] for k in human_challenge["aggregates"].values()) != 4):
                raise RuntimeError("Human challenge cannot certify phoneme recognition")
        human_sung_timing = None
        if args.human_sung_timing_reference:
            # Human-sung timed labels never enter this or any upstream
            # recognizer's inference. They are evaluation references only.
            human_sung_manifest = private_path(args.human_sung_timing_reference)
            sung_timing_receipt = stage / "human-sung-timing.json"
            human_sung_timing = json.loads(command([
                sys.executable, str(SCRIPTS / "ear_private_sung_timing_gate.py"),
                "--reference", str(human_sung_manifest),
                "--report", str(sung_timing_receipt)
            ]))
            if (human_sung_timing["humanSungPhonemeRecognition"] != "NOT_QUALIFIED" or
                human_sung_timing["speakerDisjointWitness"] is not False or
                human_sung_timing["automaticPhoneIdentityRecognition"] != "NOT_IMPLEMENTED" or
                human_sung_timing["publicMedia"] != "not-admitted"):
                raise RuntimeError("Sung timing cannot be promoted to qualified phones")
        if (browser["results"]["speechDerived"]["sha256"] != envelope["speechDerivedSHA256"]):
            raise RuntimeError("Browser and envelope analysis did not observe identical PCM")
        if (browser["results"]["procedural"]["sha256"] != envelope["proceduralSHA256"]):
            raise RuntimeError("Procedural source hash drift")
        result = {
            "schema": "ear.private-speech-e2e.v1",
            "scope": "one bounded synthetic score, private media, independent acoustic/lexical proxies",
            "status": "lexical-gate-blocked" if lexical["status"] == "blocked"
                      else "lexical-probe-matched-not-phoneme-certified",
            "browser": browser,
            "lexical": lexical,
            "vowelEnvelope": envelope,
            "phoneticResearch": phonetic_research,
            "humanSpeechReference": (
                json.loads((stage / "human-speech-witness.json").read_text())
                if human_speech is not None else None),
            "humanPronunciationChallenge": (
                json.loads((stage / "human-pronunciation-challenge.json").read_text())
                if human_challenge is not None else None),
            "humanSungTimingReference": human_sung_timing,
            "phonemeRecognition": "NOT_IMPLEMENTED",
            "humanIntelligibility": "unverified",
            "speakerIdentity": "unverified",
            "realtimeCallback": "not-tested",
            "openAISourceCaptured": False,
            "publication": "not-admitted",
            "testServicesTerminated": True
        }
    # Services and their staging audio have been disposed by the time we
    # persist this receipt; the original caller-owned /tmp assets remain.
    receipt.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"receipt": str(receipt),
                      "status": result["status"],
                      "browser": result["browser"]["status"],
                      "source": result["lexical"]["spokenReference"]["independentlyTranscribed"],
                      "candidate": result["lexical"]["speechDerived"]["independentlyTranscribed"],
                      "sourceSpectralProxy": [
                          row["sampledToSource"]
                          for row in result["vowelEnvelope"]["noteObservations"]],
                      "phonemeRecognition": "NOT_IMPLEMENTED",
                      "syntheticPhoneticProbe": (
                          result["phoneticResearch"]["iNucleus"]["status"]
                          if result["phoneticResearch"] else "not-requested"),
                      "humanSpeechReference": (
                          result["humanSpeechReference"]["status"]
                          if result["humanSpeechReference"] else "not-requested"),
                      "humanPronunciationChallenge": (
                          result["humanPronunciationChallenge"]["status"]
                          if result["humanPronunciationChallenge"] else "not-requested"),
                      "humanSungTimingReference": (
                          result["humanSungTimingReference"]["status"]
                          if result["humanSungTimingReference"] else "not-requested"),
                      "mediaPublished": False,
                      "testServicesTerminated": True}, indent=2))


if __name__ == "__main__":
    main()
