import struct
import sys
path = r'd:\proj\bottle\font\katong.ttf'
out = r'd:\proj\bottle\other\_diag_out.txt'
lines = []

def log(*a):
    lines.append(' '.join(str(x) for x in a))

fp = open(path, 'rb')
data = fp.read(12)
sfnt, numTab = struct.unpack('>IH', data[:6])
log('sfnt', hex(sfnt), 'numTables', numTab)
tables = {}
for i in range(numTab):
    rec = fp.read(16)
    tag = rec[:4].decode('latin1')
    chksum, off, ln = struct.unpack('>III', rec[4:16])
    tables[tag] = (off, ln)
log('cmap at', tables['cmap'])
off, ln = tables['cmap']
fp.seek(off)
blob = fp.read(ln)
num = struct.unpack('>H', blob[2:4])[0]
log('cmap numTables', num)
for i in range(num):
    plat, enc, soff = struct.unpack('>HHI', blob[4 + i * 8: 4 + i * 8 + 8])
    fmt = struct.unpack('>H', blob[soff:soff + 2])[0]
    sublen = struct.unpack('>H', blob[soff + 2:soff + 4])[0]
    log('enc', plat, enc, 'suboff', soff, 'fmt', fmt, 'declaredLen', sublen)
fp.close()

with open(out, 'w', encoding='utf-8') as fh:
    fh.write('\n'.join(lines))
print('done')
