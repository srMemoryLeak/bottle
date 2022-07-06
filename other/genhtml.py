import sys

temp='''
<td>
    <div class="block">
    <div id="surface%d" class="surface" hidx=0></div>
    <img crossOrigin="Anonymous", id="bottle" src="./img/bottle.png"  onclick="add('surface%d');">
    <div class="caption">%s</div>
    </div>
</td> 
'''
if __name__ =='__main__':
    id = sys.argv[1]
    xpList = open("xpList-%s.txt"%id,"r",encoding="utf8").read().split("\n")
    f = open("table-%s.html"%id,"w",encoding="utf8")
    cnt=0
    for line in xpList:
        f.write("<tr>\n")
        xpRow = line.split(" ")
        for item in xpRow:
            f.write(temp%(cnt,cnt, item))
            cnt += 1
        f.write("</tr>\n")

    f.close()