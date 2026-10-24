#!/usr/bin/env python3
"""Post-inference, source-blind-to-score lexical *probe*, NOT phoneme ASR.

Apple SpeechTranscriber reads PCM WITHOUT a target transcript. Only AFTER
independent inference does this script compare against an explicitly scoped
synthetic syllable phrase. No voice recognition, model tuning, network,
publishing, claims about auditory comprehension, or promotion to Ear phoneme
recognition. Returns status=blocked when candidate transcription mismatches.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

POSITIVE_ALIASES = frozenset(("la mi na", "la me nah", "lah me nah"))
NEGATIVE_NAMES = ("ear-negative-order.wav", "ear-negative-consonant.wav",
                  "ear-negative-silence.wav", "ear-negative-noise.wav")


def normalized(value: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", value.casefold()))


def load_receipts(paths: list[str]) -> dict[str, dict]:
    receipts = {}
    for path in paths:
        resolved = Path(path).resolve()
        if not str(resolved).startswith("/private/tmp/"):
            raise ValueError("Private transcript reports must remain in /tmp")
        report = json.loads(resolved.read_text())
        if report.get("schema") != "ear.private-transcript.v1" or report.get("status") != "finished":
            raise ValueError("Unqualified transcript source")
        for item in report["results"]:
            sid = item["sourceId"]
            if sid in receipts:
                raise ValueError("Duplicate source identity: " + sid)
            if (item["resultType"] != "independent-lexical-transcription"
                    or item["phonemeRecognition"] != "NOT_IMPLEMENTED"
                    or item["publication"] != "not-admitted"
                    or item["locale"] != "en_US"
                    or len(item["audioSHA256"]) != 64):
                raise ValueError("Unqualified source receipt for " + sid)
            receipts[sid] = item
    return receipts


def evaluate(receipts: dict[str, dict], source: str, candidate: str,
             procedural: str, negative_ids: tuple[str, ...] = NEGATIVE_NAMES) -> dict:
    required = (source, candidate, procedural, *negative_ids)
    missing = [sid for sid in required if sid not in receipts]
    if missing:
        raise ValueError("Missing independently observed controls: " + ", ".join(missing))
    if len(set(required)) != len(required):
        raise ValueError("Source, candidate, procedural and controls must all be distinct")
    aliases = {normalized(x) for x in POSITIVE_ALIASES}
    def result(sid: str) -> dict:
        item = receipts[sid]
        content = normalized(item["recognizedText"])
        return {"sourceId": sid, "audioSHA256": item["audioSHA256"],
                "independentlyTranscribed": item["recognizedText"],
                "normalized": content,
                "matchesScopedSyntheticPhrase": content in aliases}
    spoken = result(source)
    sampled = result(candidate)
    baseline = result(procedural)
    negatives = [result(sid) for sid in negative_ids]
    negativePassed = all(not item["matchesScopedSyntheticPhrase"] for item in negatives)
    sourcePassed = spoken["matchesScopedSyntheticPhrase"]
    singingPassed = sampled["matchesScopedSyntheticPhrase"]
    return {
        "schema": "ear.private-lexical-probe.v1",
        "status": "candidate-accepted" if sourcePassed and negativePassed and singingPassed else "blocked",
        "scope": "synthetic phrase-only lexical probe, assessed after independent inference",
        "acceptedLexicalVariants": sorted(aliases),
        "sourceReferencePassed": sourcePassed,
        "negativeControlsPassed": negativePassed,
        "candidateLexicallyMatched": singingPassed,
        "speechDerivedImprovesOverProcedural": (
            singingPassed and not baseline["matchesScopedSyntheticPhrase"]),
        "spokenReference": spoken,
        "speechDerived": sampled,
        "procedural": baseline,
        "negativeControls": negatives,
        "phonemeRecognition": "NOT_IMPLEMENTED",
        "humanIntelligibility": "unverified",
        "speakerIdentity": "unverified",
        "publication": "not-admitted",
        "warning": ("Even lexical matching would not certify recognized phonemes. "
                    "The fixed, small phrase aliases are not a qualified perceptual study.")
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("reports", nargs="+")
    parser.add_argument("--source", default="sing-speech-macos.wav")
    parser.add_argument("--candidate", default="sing-speech-hybrid.wav")
    parser.add_argument("--procedural", default="sing-speech-procedural.wav")
    args = parser.parse_args()
    result = evaluate(load_receipts(args.reports), args.source, args.candidate,
                      args.procedural)
    print(json.dumps(result, indent=2, sort_keys=True))
    # Nonzero only for invalid evidence; a negative/blocked finding is an
    # admissible truthful outcome of this executable research test.


if __name__ == "__main__":
    main()
