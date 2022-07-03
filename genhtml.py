temp='''
<td>
    <div class="block">
    <div id="surface%d" class="surface"></div>
    <img crossOrigin="Anonymous", id="bottle" src="bottle.png"  onclick="add('surface%d');">
    <div class="caption">%s</div>
    </div>
</td> 
'''

xpList = open("xpList.txt","r",encoding="utf8").read().split("\n")
f = open("table.html","w",encoding="utf8")
cnt=0
for line in xpList:
    f.write("<tr>\n")
    xpRow = line.split(" ")
    for item in xpRow:
        f.write(temp%(cnt,cnt, item))
        cnt += 1
    f.write("</tr>\n")

f.close()