import sys
from fontTools.ttLib import TTFont
out = r'd:\proj\bottle\other\_diag_out.txt'
path = r'd:\proj\bottle\font\katong.ttf'
lines = []
def log(*a):
    lines.append(' '.join(str(x) for x in a))

f = TTFont(path, lazy=True)
r = f.reader
log('numTables', r.numTables)
log('dir offset', r.tableDirectoryOffset if hasattr(r,'tableDirectoryOffset') else 'n/a')
log('tables keys', list(r.tables.keys()))
cmap = r.tables['cmap']
log('cmap entry', type(cmap).__name__)
off = cmap.offset
ln = cmap.length
log('cmap offset', off, 'length', ln)
# read cmap blob via fontTools stream
if hasattr(r, 'file'):
    fp = r.file
    fp.seek(off)
    blob = fp.read(ln)
    log('cmap first 16 bytes', blob[:16].hex())
    # header version + numtables
    import struct
    num = struct.unpack('>H', blob[2:4])[0]
    log('numTables(blob)', num)
    plat, enc, soff = struct.unpack('>HHI', blob[4:12])
    log('enc0', plat, enc, 'suboff', soff)
    fmt = struct.unpack('>H', blob[soff:soff+2])[0]
    sublen = struct.unpack('>H', blob[soff+2:soff+4])[0]
    log('subtable fmt', fmt, 'declaredLen', sublen)
    log('subtable first 8', blob[soff:soff+8].hex())

with open(out, 'w', encoding='utf-8') as fh:
    fh.write('\n'.join(lines))
print('done')
