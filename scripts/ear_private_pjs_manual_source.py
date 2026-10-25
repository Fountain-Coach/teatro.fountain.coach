#!/usr/bin/env python3
"""Ear: privately acquire ONE independently human-reannotated PJS song reference.

Original PJS ver1.1 audio/labels: Koguchi & Takamichi, CC BY-SA 4.0,
https://sites.google.com/site/shinnosuketakamichi/research-topics/pjs_corpus
Independent *human* relabel: UtaUtaUtau/pjs-manual-labels v2, CC BY-SA 4.0,
pinned GitHub commit. A second human annotation of original material is
not a third independent listener's adjudication, nor an English recognizer.

Preselected pjs001, ZIP-bounded HTTP byte ranges, original ZIP member CRC
and SHA, human label SHA. Not trained on, republished, or voice-cloned.
"""
from __future__ import annotations

import argparse
import collections
import hashlib
import html
import io
import json
from pathlib import Path
import re
import urllib.request
import wave
import zipfile

ROOT=Path("/tmp/ear-pjs-manual-timed-20261025")
SOURCE_LICENSE_URL="https://sites.google.com/site/shinnosuketakamichi/research-topics/pjs_corpus"
DRIVE_ID="1hPHwOkSe2Vnq6hXrhVtzNskJjVMQmvN_"
ZIP_URL="https://drive.usercontent.google.com/download?id="+DRIVE_ID+"&export=download&confirm=t"
ZIP_BYTES=275179158
ORIGINAL_AUDIO_MEMBER="PJS_corpus_ver1.1/pjs001/pjs001_song.wav"
ORIGINAL_LAB_MEMBER="PJS_corpus_ver1.1/pjs001/pjs001.lab"
MANUAL_COMMIT="022d09bffeda9ca122d59a9e5ebfcedd98f5709a"
MANUAL_REPO="UtaUtaUtau/pjs-manual-labels"
MANUAL_PATH="v2/pjs001.lab"
MANUAL_README="README.md"
MANUAL_BASE="https://raw.githubusercontent.com/"+MANUAL_REPO+"/"+MANUAL_COMMIT+"/"
LICENSE="CC BY-SA 4.0"
ATTRIBUTION_ORIGINAL="Junya Koguchi and Shinnosuke Takamichi, PJS: Phoneme-balanced Japanese Singing-voice corpus (2020)"
ATTRIBUTION_MANUAL="UtaUtaUtau, PJS Manual Labels, independent human reannotation, CC BY-SA 4.0"
BLOCK=256*1024
TOTAL_BUDGET=10*1024*1024
EXPECTED={
 "pjs001-song.wav":"cbd14289cea8c5cd2e7a859076a2448f852143f8e5868b7cb655270764cf4f3a",
 "pjs001-original.lab":"864b4178871538f19125128945a6a1f03c690e215df064a247496508981bd4bf",
 "pjs001-independent-manual-v2.lab":"a00d794e580c6210d2eb6cfb31511b75ada1f145b6fe954f3131270f8b81bf11",
 "annotation-source-readme.md":"d4ff8822e33d141a6eb3f8a34e3853a77002a996f572e8794ae46f727ec1dc05",
}
CRC={
 "pjs001-song.wav":"65fea510",
 "pjs001-original.lab":"e17ceb2a",
}


def sha(blob:bytes)->str:
    return hashlib.sha256(blob).hexdigest()


def private(path:Path)->Path:
    p=path.expanduser().resolve()
    if not str(p).startswith("/private/tmp/"):
        raise ValueError("PJS research source must stay private under /tmp")
    return p


class RangeZIP(io.RawIOBase):
    def __init__(self,size:int=ZIP_BYTES,fetch=None):
        if size!=ZIP_BYTES:raise ValueError("Unexpected PJS archive size")
        self.length=size;self.pos=0
        self.cache=collections.OrderedDict()
        self.total=0;self.requests=0
        self.fetch=fetch if fetch is not None else self.fetch_source
    def readable(self):return True
    def seekable(self):return True
    def tell(self):return self.pos
    def seek(self,offset,whence=0):
        position=offset if whence==0 else self.pos+offset if whence==1 else self.length+offset if whence==2 else -1
        if not 0<=position<=self.length:raise ValueError("Invalid archive offset")
        self.pos=position;return position
    @staticmethod
    def fetch_source(start:int,end:int)->bytes:
        if not 0<=start<=end<ZIP_BYTES or end-start+1>BLOCK:
            raise ValueError("Source read outside bounded byte range")
        request=urllib.request.Request(
            ZIP_URL,headers={"Range":f"bytes={start}-{end}",
                             "User-Agent":"FountainCoach-Ear-PJS-Private/1"})
        with urllib.request.urlopen(request,timeout=30) as response:
            blob=response.read(end-start+2)
            if (response.status!=206
                or response.headers.get("Content-Range","").split("/")[0]
                   !=f"bytes {start}-{end}"
                or len(blob)!=end-start+1):
                raise ValueError("PJS origin did not honor byte-range contract")
            return blob
    def read(self,n:int=-1)->bytes:
        if n is None or n<0:n=self.length-self.pos
        if n>4*1024*1024:raise ValueError("Unbounded PJS read")
        end=min(self.length,self.pos+n);out=[]
        while self.pos<end:
            idx=self.pos//BLOCK
            if idx not in self.cache:
                left=idx*BLOCK;right=min(self.length,left+BLOCK)-1
                if self.total+right-left+1>TOTAL_BUDGET:
                    raise ValueError("PJS ZIP network ceiling exceeded")
                raw=self.fetch(left,right)
                if len(raw)!=right-left+1:
                    raise ValueError("Source ZIP range truncated")
                self.total+=len(raw);self.requests+=1;self.cache[idx]=raw
                while len(self.cache)>12:self.cache.popitem(last=False)
            else:self.cache.move_to_end(idx)
            b=self.cache[idx];i=self.pos%BLOCK
            amount=min(end-self.pos,len(b)-i)
            if amount<=0:raise ValueError("Unreadable source ZIP range")
            out.append(b[i:i+amount]);self.pos+=amount
        return b"".join(out)


def fetch_public_text(url:str,max_bytes=700000)->bytes:
    if url not in (SOURCE_LICENSE_URL,MANUAL_BASE+MANUAL_PATH,MANUAL_BASE+MANUAL_README):
        raise ValueError("Remote PJS origin not in allowlist")
    with urllib.request.urlopen(
        urllib.request.Request(url,headers={"User-Agent":"Ear-PJS-Provenance/1.0"}),
        timeout=20
    ) as f:
        if f.status!=200:raise ValueError("Unable to verify PJS source")
        blob=f.read(max_bytes+1)
    if len(blob)>max_bytes:raise ValueError("Unbounded PJS rights/label response")
    return blob


def verify_rights(source_html:bytes,readme:bytes)->None:
    h=html.unescape(source_html.decode("utf-8",errors="replace")).lower()
    text=readme.decode("utf-8",errors="strict").lower()
    if ("cc by-sa 4.0" not in h
        or "free for non-commercial and commercial use" not in h
        or "cc by-sa 4.0" not in text
        or "manually labeled by a human" not in text
        or "htk mono label format" not in text):
        raise ValueError("Original PJS or independent annotation provenance changed")


def verify_files(root:Path=ROOT)->list[dict]:
    root=private(root)
    output=[]
    for name,expected_sha in EXPECTED.items():
        file=private(root/name)
        if not file.is_file():raise ValueError("Required original PJS source absent "+name)
        actual=sha(file.read_bytes())
        if actual!=expected_sha:raise ValueError("Original PJS source identity drift "+name)
        output.append({"name":name,"path":str(file),"sha256":actual,
                       "size":file.stat().st_size})
    with wave.open(str(root/"pjs001-song.wav"),"rb")as w:
        if (w.getnchannels(),w.getframerate(),w.getsampwidth(),
            w.getcomptype(),w.getnframes())!=(1,48000,3,"NONE",768000):
            raise ValueError("PJS original 16-second 48kHz 24-bit WAV drift")
    return output


def import_reference(root:Path=ROOT,download:bool=False)->dict:
    root=private(root)
    if download:
        origin_html=fetch_public_text(SOURCE_LICENSE_URL)
        raw_readme=fetch_public_text(MANUAL_BASE+MANUAL_README)
        verify_rights(origin_html,raw_readme)
        root.mkdir(parents=True,exist_ok=True)
        reader=RangeZIP()
        with zipfile.ZipFile(reader,"r")as archive:
            for member,name in (
                (ORIGINAL_AUDIO_MEMBER,"pjs001-song.wav"),
                (ORIGINAL_LAB_MEMBER,"pjs001-original.lab")
            ):
                info=archive.getinfo(member)
                if (f"{info.CRC:08x}"!=CRC[name]
                    or info.file_size>3*1024*1024 or info.file_size<100
                    or info.compress_size>3*1024*1024):
                    raise ValueError("Original ZIP member size/CRC mismatch")
                with archive.open(info)as stream:
                    blob=stream.read(info.file_size+1)
                    if stream.read(1) or len(blob)!=info.file_size:
                        raise ValueError("Original ZIP member unbounded")
                if sha(blob)!=EXPECTED[name]:
                    raise ValueError("Archive member failed original SHA identity")
                dest=root/name
                if dest.exists() and dest.read_bytes()!=blob:
                    raise ValueError("Existing source recording/labels drift")
                if not dest.exists():dest.write_bytes(blob)
        for name,url in (
            ("pjs001-independent-manual-v2.lab",MANUAL_BASE+MANUAL_PATH),
            ("annotation-source-readme.md",MANUAL_BASE+MANUAL_README)
        ):
            blob=fetch_public_text(url,max_bytes=100000)
            if sha(blob)!=EXPECTED[name]:
                raise ValueError("Remote manual label/README SHA drift")
            dest=root/name
            if dest.exists() and dest.read_bytes()!=blob:
                raise ValueError("Existing third-party human annotation drift")
            if not dest.exists():dest.write_bytes(blob)
        imported_bytes=reader.total
    else:
        imported_bytes=None

    files=verify_files(root)
    result={
        "schema":"ear.private-pjs-independent-timed-singing.v1",
        "source":"PJS corpus 1.1 original recording and original alignment, separately reannotated by human",
        "originalCorpusURL":SOURCE_LICENSE_URL,
        "originalArchiveURL":ZIP_URL,
        "originalArchiveBytes":ZIP_BYTES,
        "entireOriginalZIPChecksumVerified":False,
        "originalArchiveMember":ORIGINAL_AUDIO_MEMBER,
        "originalLabelMember":ORIGINAL_LAB_MEMBER,
        "originalAudioZIPMemberCRC32":CRC["pjs001-song.wav"],
        "originalLabelZIPMemberCRC32":CRC["pjs001-original.lab"],
        "originalLicense":LICENSE,
        "originalCreatorAttribution":ATTRIBUTION_ORIGINAL,
        "manualLabelRepository":MANUAL_REPO,
        "manualLabelCommit":MANUAL_COMMIT,
        "manualLabelPath":MANUAL_PATH,
        "manualLabelLicense":LICENSE,
        "manualLabelCreatorAttribution":ATTRIBUTION_MANUAL,
        "independentManualReannotationPresent":True,
        "manualReannotationIsThirdIndependentAdjudication":False,
        "language":"Japanese",
        "vocalReferenceKind":"sung",
        "sourcePerformerCount":1,
        "phonemeInventory":"PJS_JAPANESE_ROMAJI_ORIGINAL_CASE_SENSITIVE",
        "originalAnnotationsAndManualLabelsAreIndependentReferenceVersions":True,
        "englishPocketSphinxPhoneInventoryCompatible":False,
        "recognitionSourceLabelsSentToDecoder":False,
        "recognitionModelApplied":False,
        "sourceSingerVerifiedIndependentFromAIDolByIdentity":False,
        "humanListenerIntelligibilityVerified":False,
        "singVoicebankRightsGranted":False,
        "trainingAuthorizedByThisImporter":False,
        "publicMediaReleased":False,
        "files":files,
        "boundedOriginalZIPTransferredBytes":imported_bytes,
    }
    dest=root/"manifest.json"
    if dest.exists():
        earlier=json.loads(dest.read_text())
        for k in result:
            if k=="boundedOriginalZIPTransferredBytes":continue
            if earlier.get(k)!=result[k]:
                raise ValueError("PJS original source manifest drift: refuse overwrite")
        return earlier
    dest.write_text(json.dumps(result,indent=2,sort_keys=True)+"\n")
    return result


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--fetch",action="store_true")
    args=parser.parse_args()
    r=import_reference(download=args.fetch)
    print(json.dumps({
        "originalSourceSHA256":r["files"][0]["sha256"],
        "manualLabelSHA256":next(x["sha256"]for x in r["files"] if x["name"]=="pjs001-independent-manual-v2.lab"),
        "originalAndManualLabelLicense":LICENSE,
        "separateHumanRevision":True,
        "phoneRecognitionQualified":False,
        "sourceVoicebankAuthorized":False,
        "mediaPublished":False,
    },indent=2))


if __name__=="__main__":
    main()
