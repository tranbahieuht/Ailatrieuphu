"""Extract the five supplied videos: python scripts/import-audio.py D:/Nhạc.

Requires ffmpeg on PATH, or: python -m pip install imageio-ffmpeg
The resulting MP3 files are standalone assets; deployment needs no Python/ffmpeg.
"""
import json
from pathlib import Path
import shutil
import subprocess
import sys

source = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('D:/Nhạc')
destination = Path(__file__).resolve().parents[1] / 'public' / 'audio'
ffmpeg = shutil.which('ffmpeg')
if not ffmpeg:
    import imageio_ffmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

# Use the first complete wrong-answer cue, ending at the first silent gap.
tracks = [
    ('intro', 'INTRO AI LÀ TRIỆU PHÚ 2015-2020 TRÊN POWERPOINT (1).mp4', None),
    ('correct-10', 'Ai là triệu phú - Nhạc trả lời đúng câu 10 (Không phải mốc quan trọng).mp4', None),
    ('victory', 'Ai Là Triệu Phú - Nhạc trả lời đúng câu hỏi số 15 (Bản dài).mp4', None),
    ('ending', 'Nhạc Hiệu Kết Thúc Ai Là Triệu Phú 2020 In Mari Group Cubed Low Voice.mp4', None),
    ('wrong', 'Tổng hợp âm thanh trả lời sai - Ai là triệu phú VTV3.mp4', 8.7),
]
for _, filename, _ in tracks:
    if not (source / filename).is_file():
        raise FileNotFoundError(source / filename)

destination.mkdir(parents=True, exist_ok=True)
provenance = {}
for name, filename, seconds in tracks:
    command = [ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
               '-i', str(source / filename), '-map', '0:a:0', '-vn']
    if seconds:
        command += ['-t', str(seconds)]
    command += ['-codec:a', 'libmp3lame', '-q:a', '2', str(destination / f'{name}.mp3')]
    subprocess.run(command, check=True)
    provenance[name] = {'source': filename, 'startSeconds': 0, 'endSeconds': seconds}
    print(f'{name}.mp3 ready')
(destination / 'sources.json').write_text(
    json.dumps(provenance, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
