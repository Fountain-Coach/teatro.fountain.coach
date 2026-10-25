#!/usr/bin/env python3
"""Ear: bounded CC BY 4.0 two-singer vocal-acoustics holdout, NOT timed phones.

Source: Wilkins, Seetharaman, Wahl & Pardo, VocalSet 1.1 (2018),
https://doi.org/10.5281/zenodo.1203819. Zenodo advertises CC BY 4.0.
Only predeclared f9 and m2 straight vowel-A scales are fetched from the
~2.1GB ZIP via HTTP byte ranges: no full corpus or voicebank downloaded.
Their filename vowel label is not a human phone-time annotation, and
VocalSet cannot satisfy Ear's independently timed phone recognition gate.

Everything stays private under /tmp. The payload is source-cited by SHA,
single ZIP member CRC, declared original dataset license and singer IDs.
Never put WAVs, a model, source stems or any voice examples into public Git.
"""
from __future__ import annotations

import argparse
from collections import OrderedDict
import hashlib
import io
import json
from pathlib import Path
import re
import urllib.request
import wave
import zipfile

ROOT=Path("/tmp/ear-vocalset-ccby4-holdout-20261025")
RECORD_ID=1203819
DOI="10.5281/zenodo.1203819"
META=f"https://zenodo.org/api/records/{RECORD_ID}"
ZIP_URL=f"https://zenodo.org/api/records/{RECORD_ID}/files/VocalSet11.zip/content"
ZIP_BYTES=2077243579
ZIP_MD5="md5:0c09396242f946e7111ad7d8fc649b81"
LICENSE="cc-by-4.0"
BLOCK_BYTES=256*1024
TOTAL_REMOTE_BUDGET=16*1024*1024
MAX_MEMBER_SIZE=2*1024*1024
PREDECLARED=(
    ("female9","FULL/female9/scales/straight/f9_scales_straight_a.wav"),
    ("male2","FULL/male2/scales/straight/m2_scales_straight_a.wav"),
)
ATTRIBUTION="Julia Wilkins, Prem Seetharaman, Alison Wahl, Bryan Pardo, VocalSet: A Singing Voice Dataset, version 1.1, Zenodo (2018), https://doi.org/10.5281/zenodo.1203819 (CC BY 4.0)"


def sha(data: bytes)->str:
    return hashlib.sha256(data).hexdigest()


def get_json(url: str)->dict:
    if url!=META:
        raise ValueError("Only the predeclared official Zenodo metadata URL")
    req=urllib.request.Request(url,headers={"User-Agent":"FountainCoach-Ear-Provenance/1.0"})
    with urllib.request.urlopen(req,timeout=20) as response:
        if response.status!=200:
            raise ValueError("Zenodo source metadata request rejected")
        raw=response.read(500001)
    if len(raw)>500000:
        raise ValueError("Unexpectedly large rights metadata")
    return json.loads(raw)


def verify_license(m: dict)->dict:
    files=m.get("files",[])
    if (m.get("id")!=RECORD_ID or
        m.get("metadata",{}).get("doi")!=DOI or
        m.get("metadata",{}).get("license",{}).get("id")!=LICENSE or
        len(files)!=1 or
        files[0].get("key")!="VocalSet11.zip" or
        files[0].get("size")!=ZIP_BYTES or
        files[0].get("checksum")!=ZIP_MD5 or
        files[0].get("links",{}).get("self")!=ZIP_URL):
        raise ValueError("Dataset provenance/license has changed: do not fetch audio")
    return {"zenodoRecord":RECORD_ID,"doi":DOI,
            "license":LICENSE,"archiveBytes":ZIP_BYTES,
            "archivePublishedMD5":ZIP_MD5,
            "wholeArchiveDownloadedOrMD5Verified":False,
            "remoteMetadataSHA256":sha(json.dumps(m,sort_keys=True).encode())}


class HTTPRangeArchive(io.RawIOBase):
    """Read-only seekable ZIP range reader, with 16MB total network ceiling."""
    def __init__(self,size:int=ZIP_BYTES,fetch=None):
        super().__init__()
        if size<100000 or size>ZIP_BYTES:
            raise ValueError("Unbounded source ZIP size")
        self.length=size
        self.position=0
        self.cache=OrderedDict()
        self.total=0
        self.requests=0
        self.fetch=fetch or self.fetch_public

    @staticmethod
    def fetch_public(start:int,end:int)->bytes:
        if start<0 or end<start or end>=ZIP_BYTES or end-start+1>BLOCK_BYTES:
            raise ValueError("Illegal remote archive read range")
        req=urllib.request.Request(
            ZIP_URL,headers={
                "Range":f"bytes={start}-{end}",
                "User-Agent":"FountainCoach-Ear-BoundedVocalSet/1.0"
            })
        with urllib.request.urlopen(req,timeout=28) as response:
            data=response.read(end-start+2)
            if (response.status!=206 or
                response.headers.get("Content-Range","").split("/")[0]
                !=f"bytes {start}-{end}" or
                len(data)!=end-start+1):
                raise ValueError("Source declined the bounded byte-range contract")
        return data

    def readable(self):return True
    def seekable(self):return True
    def tell(self):return self.position
    def seek(self,offset:int,whence:int=io.SEEK_SET):
        new=(offset if whence==0 else
             self.position+offset if whence==1 else
             self.length+offset if whence==2 else None)
        if new is None or new<0 or new>self.length:
            raise ValueError("Invalid sparse ZIP seek")
        self.position=new
        return new

    def read(self,size:int=-1)->bytes:
        if size is None or size<0:size=self.length-self.position
        if size>MAX_MEMBER_SIZE+BLOCK_BYTES*2:
            raise ValueError("Excessive individual byte-range read")
        end=min(self.length,self.position+size)
        chunks=[]
        while self.position<end:
            index=self.position//BLOCK_BYTES
            if index not in self.cache:
                left=index*BLOCK_BYTES
                right=min(self.length,left+BLOCK_BYTES)-1
                if self.total+right-left+1>TOTAL_REMOTE_BUDGET:
                    raise ValueError("Sparse ZIP network budget exceeded")
                raw=self.fetch(left,right)
                if len(raw)!=right-left+1:
                    raise ValueError("Truncated remote source range")
                self.cache[index]=raw
                self.total+=len(raw)
                self.requests+=1
                while len(self.cache)>10:self.cache.popitem(last=False)
            else:self.cache.move_to_end(index)
            raw=self.cache[index]
            cursor=self.position%BLOCK_BYTES
            n=min(end-self.position,len(raw)-cursor)
            if n<=0:raise ValueError("Invalid sparse read fragment")
            chunks.append(raw[cursor:cursor+n])
            self.position+=n
        return b"".join(chunks)


def validate_audio(raw:bytes)->tuple[float,int,int]:
    if len(raw)<44 or len(raw)>MAX_MEMBER_SIZE:
        raise ValueError("Unbounded VocalSet reference PCM")
    with wave.open(io.BytesIO(raw),"rb") as a:
        channels=a.getnchannels()
        width=a.getsampwidth()
        rate=a.getframerate()
        duration=a.getnframes()/rate
        if (a.getcomptype()!="NONE" or channels not in (1,2)
            or width not in (2,3,4) or not 22050<=rate<=96000
            or not 2<=duration<=30):
            raise ValueError("Untrusted VocalSet source audio format/duration")
    return round(duration,5),rate,channels


def expected_manifest(licensed:dict, members:list[dict], remote_bytes:int)->dict:
    return {
        "schema":"ear.private-vocalset-two-singer-acoustic-holdout.v1",
        "source":"VocalSet version 1.1 official Zenodo record",
        "creatorAttribution":ATTRIBUTION,
        "sourceDOI":DOI,
        "license":LICENSE,
        "rights":licensed,
        "speakerPseudonymsDifferent":True,
        "speakerIDsPreselectedBeforeAcousticInference":True,
        "claimedIndependentRealPersonIdentityVerification":False,
        "referenceSingingAudio":True,
        "speakerCountAccordingToDataset":2,
        "selection":"Two fixed straight-vowel-A scale WAVs, from two separate VocalSet speaker folders",
        "vowelTaskFromFileName":"a",
        "phonemeSequenceReference":"NOT_SUPPLIED",
        "independentlyAuditedPhoneIdentities":False,
        "independentlyTimedPhoneBoundaries":False,
        "speakerDisjointTimedPhonemeEvaluation":"NOT_AVAILABLE",
        "trainingOrVoicebankAuthorizationByThisImporter":False,
        "sourceLyricsSuppliedToInference":False,
        "sourceLabelSuppliedToInference":False,
        "acousticPositiveTestOnly":True,
        "records":members,
        "remoteRangeBytesTransferred":remote_bytes,
        "originalZipFullChecksumVerified":False,
        "allWavZIPMemberCRCsVerified":True,
        "mediaPublished":False,
    }


def fetch_selection(root:Path=ROOT,metadata:dict|None=None,
                    reader_factory=None)->dict:
    if not str(root.expanduser().resolve()).startswith("/private/tmp/"):
        raise ValueError("VocalSet private audio must be under /tmp")
    licensed=verify_license(metadata if metadata is not None else get_json(META))
    root.mkdir(parents=True,exist_ok=True)
    reader=reader_factory() if reader_factory else HTTPRangeArchive()
    entries=[]
    with zipfile.ZipFile(reader,"r") as archive:
        for singer,filename in PREDECLARED:
            member=archive.getinfo(filename)
            if (member.file_size>MAX_MEMBER_SIZE or member.file_size<300000
                or member.compress_size>MAX_MEMBER_SIZE
                or not re.fullmatch(r"[fm][0-9]+_scales_straight_a.wav",
                                    Path(filename).name)):
                raise ValueError("Wrong predeclared vowel/voice ZIP member")
            # ZIP verifies the exact member CRC while reading. No full archive
            # download, hidden archive extraction, or metadata inference.
            with archive.open(member) as src:
                raw=src.read(MAX_MEMBER_SIZE+1)
                if src.read(1) or len(raw)!=member.file_size:
                    raise ValueError("ZIP member expanded size mismatch")
            duration,rate,channels=validate_audio(raw)
            dst=root/(singer+"-straight-a.wav")
            if dst.exists():
                if dst.read_bytes()!=raw:
                    raise ValueError("Previously downloaded speaker source drift")
            else:
                dst.write_bytes(raw)
            entries.append({
                "speakerID":singer,
                "archiveMember":filename,
                "memberZipCRC32":f"{member.CRC:08x}",
                "audioPath":str(dst.resolve()),
                "audioSHA256":sha(raw),
                "audioBytes":len(raw),
                "sampleRate":rate,
                "channels":channels,
                "durationSeconds":duration,
                "vowelTaskLabel":"a",
                "phonemeBoundaries":"NOT_SUPPLIED",
                "phonemeIdentityIndependentlyVerified":False,
                "publicVoiceOrSingerModelAuthorized":False,
            })
    if len(set(x["audioSHA256"] for x in entries))!=2:
        raise ValueError("Two WAVs are not independent audio identities")
    report=expected_manifest(licensed,entries,reader.total)
    report_path=root/"manifest.json"
    if report_path.exists():
        old=json.loads(report_path.read_text())
        # HTTP fetch volume and API metadata may change without WAVs
        # changing; preserve prior manifest identity for a reproducible
        # witness rather than rewriting an established report.
        for key in ("records","license","sourceDOI","schema","speakerCountAccordingToDataset"):
            if old.get(key)!=report.get(key):
                raise ValueError("Original source manifest identity drift")
        return old
    report_path.write_text(json.dumps(report,indent=2,sort_keys=True)+"\n")
    return report


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",default=str(ROOT))
    args=parser.parse_args()
    result=fetch_selection(Path(args.out))
    print(json.dumps({
        "source":result["source"],
        "license":result["license"],
        "speakerIDs":[r["speakerID"] for r in result["records"]],
        "sha":[r["audioSHA256"]for r in result["records"]],
        "audioSeconds":[r["durationSeconds"]for r in result["records"]],
        "onlyTwoSelectedRecordings":True,
        "remoteRangeBytesTransferred":result["remoteRangeBytesTransferred"],
        "independentPhoneTimes":False,
        "mediaPublished":False,
    },indent=2))


if __name__=="__main__":
    main()
