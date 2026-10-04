"""Verify React state changes and parity with the user-accepted UMG baseline."""
import json
from pathlib import Path
from PIL import Image, ImageChops
root = Path(__file__).resolve().parents[2] / 'Saved/DesignBridge/genshin_cover'
report = json.loads((root / 'react-preview-report.json').read_text(encoding='utf-8'))
assert report['ok'] and report['rootClass'] == 'ReactWidget'
baseline = Image.open(root / 'accepted-umg.png').convert('RGBA')
rendered = Image.open(root / 'ue-react-preview.png').convert('RGBA')
hidden = Image.open(root / 'ue-react-hidden.png').convert('RGBA')
assert baseline.size == rendered.size == hidden.size
assert ImageChops.difference(baseline, rendered).getbbox(alpha_only=False) is None, 'React differs from accepted UMG'
assert hidden.getchannel('A').getextrema() == (0, 0), 'React opacity state did not affect the rendered widgets'
result = {'ok': True, 'rootClass': report['rootClass'], 'size': rendered.size, 'differentPixelsFromAcceptedUMG': 0,
          'hiddenStateAlpha': [0, 0], 'reactStateReconciliation': 'passed', 'userReactAcceptance': 'pending'}
(root / 'react-acceptance-report.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result, indent=2))
