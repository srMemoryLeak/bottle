const xp_list={
    "7":[
        "失禁","尿布","尿床","故意失禁","户外失禁","高潮失禁",
        "憋尿","极限憋尿","排泄控制","放尿时\n回憋","捆绑憋尿","憋尿时\nedge",
        "喝尿","长时间\n充盈","小腹的\n隆起","虐小腹","测容量","模拟排尿",
        "放尿","极限放尿","野外放尿","强制放尿","容器放尿","裸体放尿",
        "牛仔裤","女仆装","舞蹈服","JK","lolita",],
    "87":[
        "裤兜","人前","床上","野外","容器排便","故意裤兜",
        "忍便","长时间忍便","大量忍便","排泄控制","排泄时回憋","模拟排便",
        "胀气","小腹的隆起","虐小腹","腹痛","肛塞","裸体排便",
        "便秘","腹泻","集体腹泻","自然正常便","灌肠","大量排便",
        "排泄物","稀便","屁","涂抹","吞便","憋便自慰",
        "牛仔裤","女仆装","舞蹈服","JK","纸尿裤",
    ],
    "85":[
    "纸尿裤","布制尿布","隔尿垫","尿布外出","尿布露出","强制穿尿布",
    "失禁","尿床","无意识失禁","故意失禁","尿湿衣物","装满的尿布",
    "婴儿玩具","精神退行","裤兜","如厕训练","把尿","拘束",
    "换尿布","喂食","喂奶","打屁股","奶嘴","奶瓶",
    "DDLG","DDLB","MDLG","MDLB","哥哥","姐姐",
    "围兜","婴儿连体服","开裆裤","女仆装","JK",
    ],
}

function add(id){
    var surface = document.getElementById(id);
    var heightList=[0, 26, 50, 60, 74, 98];
    var hidx = parseInt( surface.getAttribute("hidx"));
    hidx = (hidx+1)%heightList.length;
    surface.setAttribute("hidx",hidx);
    surface.style.height = heightList[hidx]+"%";
    //showToast("液体高度已调整（"+(hidx+1)+"/"+heightList.length+"）","info");
}

var currentPart = "7"; // 当前分区键（对应 xp_list 的键）
var bottleCount = 0;   // 已创建的瓶子总数（用于生成唯一 id）
var deleteMode = false; // 删除模式开关

// 创建一个瓶子块，返回其 DOM 元素。
// isQR 为 true 时创建"二维码瓶子"：图片为二维码、无液体、无删除按钮
function createBottle(xp, id, isQR){
    var block = document.createElement("div");
    block.setAttribute("class","block");

    // 瓶子容器：包裹瓶子图片与液体，让高度由瓶子图片决定
    var wrap = document.createElement("div");
    wrap.setAttribute("class","bottle-wrap");

    if(!isQR){
        var surface = document.createElement("div");
        surface.setAttribute("id", id);
        surface.setAttribute("class","surface");
        surface.setAttribute("hidx","0");
        wrap.appendChild(surface);
    }

    var img = document.createElement("img");
    img.setAttribute("class","bottle");
    img.setAttribute("crossOrigin","Anonymous");
    if(isQR){
        img.setAttribute("src","./img/qrcode.png");
    }else{
        img.setAttribute("src","./img/bottle.png");
        //img.setAttribute("title","点击调整液体高度");
        img.setAttribute("data-bs-toggle","tooltip");
        img.setAttribute("data-bs-placement","top");
        img.setAttribute("onclick","add('"+id+"');");
    }
    wrap.appendChild(img);

    block.appendChild(wrap);

    // 文字说明：紧随瓶子下方
    var caption = document.createElement("div");
    caption.setAttribute("class","caption");
    caption.innerText = xp;
    block.appendChild(caption);

    // 删除按钮：默认隐藏，进入删除模式后显示在瓶子右上角（二维码瓶子不创建）
    if(!isQR){
        var delBtn = document.createElement("div");
        delBtn.setAttribute("class","del-btn");
        delBtn.setAttribute("title","删除此瓶子");
        delBtn.innerHTML = "×";
        delBtn.setAttribute("onclick","event.stopPropagation(); removeBottle(this);");
        block.appendChild(delBtn);
    }else{
        block.classList.add("qr-block");
    }

    return block;
}

// 清空瓶子区并按当前分区重建所有瓶子
function renderBottles(){
    var grid = document.getElementById("nl_tbody");
    grid.innerHTML = "";
    bottleCount = 0;
    var list = xp_list[currentPart] || [];
    for(var i=0;i<list.length;i++){
        var id = "surface" + bottleCount;
        var block = createBottle(list[i], id);
        bottleCount++;
        grid.appendChild(block);
    }
    // 最后追加"二维码瓶子"（固定最后一个，不参与编号、无删除按钮）
    grid.appendChild(createBottle("扫码填写", "qrsurface", true));
}

function addBottles(){
    renderBottles();
}

// 打开"增加瓶子"对话框
function addBottle(){
    var input = document.getElementById("newBottleInput");
    if(input) input.value = "";
    var modalEl = document.getElementById("addBottleModal");
    var modal = bootstrap.Modal.getInstance(modalEl);
    if(!modal) modal = new bootstrap.Modal(modalEl);
    modal.show();
    setTimeout(function(){
        var i = document.getElementById("newBottleInput");
        if(i) i.focus();
    },300);
}

// 确认增加瓶子：追加到瓶子区末尾
function confirmAddBottle(){
    var input = document.getElementById("newBottleInput");
    var xp = (input ? input.value.trim() : "");
    if(xp === "") xp = "新瓶子";

    var modalEl = document.getElementById("addBottleModal");
    var modal = bootstrap.Modal.getInstance(modalEl);
    if(modal) modal.hide();

    var id = "surface" + bottleCount;
    var block = createBottle(xp, id);
    bottleCount++;
    // 新增瓶子插入到二维码瓶子之前，保证二维码始终是最后一个
    var grid = document.getElementById("nl_tbody");
    var qrBlock = grid.querySelector(".qr-block");
    if(qrBlock){
        grid.insertBefore(block, qrBlock);
    }else{
        grid.appendChild(block);
    }
    if(deleteMode){
        block.querySelector(".del-btn").style.display = "flex";
    }
    showToast("已增加瓶子："+xp,"success");
}

// 切换删除模式：显示/隐藏各瓶子右上角的红色删除按钮
function toggleDelete(){
    deleteMode = !deleteMode;
    var btn = document.getElementById("delBtn");
    var delBtns = document.querySelectorAll(".del-btn");
    if(deleteMode){
        btn.innerText = "完成";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-secondary");
        for(var i=0;i<delBtns.length;i++){
            delBtns[i].style.display = "flex";
        }
        showToast("点击瓶子右上角的红色按钮删除","warning");
    }else{
        btn.innerText = "删除瓶子";
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-danger");
        for(var i=0;i<delBtns.length;i++){
            delBtns[i].style.display = "none";
        }
    }
}

// 删除单个瓶子
function removeBottle(delBtn){
    var block = delBtn.closest(".block");
    block.remove();
    // 若没有可删除的普通瓶子了（二维码瓶子不算），自动退出删除模式
    if(document.querySelectorAll(".block:not(.qr-block)").length === 0){
        deleteMode = false;
        var btn = document.getElementById("delBtn");
        btn.innerText = "删除瓶子";
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-danger");
    }
    showToast("瓶子已删除","success");
}

function changeColor(color, el){
    var surfaces = document.getElementsByClassName("surface");
    for(var i=0;i<surfaces.length;i++){
        surfaces[i].style.backgroundColor=color;
    }
    var boxes = document.querySelectorAll(".colorbox");
    for(var i=0;i<boxes.length;i++){
        boxes[i].classList.remove("color-active");
    }
    if(el){
        el.classList.add("color-active");
    }
    showToast("颜色已应用："+color,"primary");
}

function screenshot(){
    var btn = document.getElementById("downloadBtn");
    var oldHTML = btn.innerHTML;
    var img = document.getElementById("img");
    var w = img.offsetWidth;
    var h = img.offsetHeight;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>生成中...';
    html2canvas(img,{width : w,height : h,tainttest : true,allowTaint: true,useCORS:true}).then(function(canvas) {
        var url = canvas.toDataURL("image/png");
        var triggerDownload = document.createElement("a");
        triggerDownload.setAttribute("href",url);
        triggerDownload.setAttribute("download", "img.png");
        document.body.appendChild(triggerDownload);
        triggerDownload.click();
        triggerDownload.remove();

        btn.disabled = false;
        btn.innerHTML = oldHTML;
        showToast("图片已生成并开始下载！","success");
    }).catch(function(){
        btn.disabled = false;
        btn.innerHTML = oldHTML;
        showToast("生成失败，请重试","danger");
    });
}

function fill(){
    lastcaption = document.getElementById("lastcaption");
    var str = prompt("すきな性癖を入りましょう~");
    if(str.length==0){
        str="(______)"
    }
    lastcaption.innerText = str;
}

function addColor(){
    var colorList=[
        //blue
        "navy",
        "DarkBlue",
        "royalblue",
        "SlateBlue",
        "steelblue",
        "lightskyblue",
        "LightSteelBlue",
        "PaleTurquoise",
        "aqua",
        "DarkSlateGray",
        //green
        "aquamarine",
        "LightSeaGreen",
        "lightgreen",
        "olivedrab",
        "LightGreen",
        "SeaGreen",
        "Teal",
        "YellowGreen",
        "LimeGreen",
        "Green",
        //other
        "coral",
        "darkorange",
        "firebrick",
        "indianred",
        "Salmon",
        "BurlyWood",
        "Khaki",
        "PaleVioletRed",
        "Plum",
        "pink",
    ];
    var grid = document.getElementById("colorlist_tbody");

    // 自定义颜色块：点击弹出 Coloris 调色盘
    var custom = document.createElement("div");
    custom.setAttribute("class","colorbox color-custom");
    custom.setAttribute("title","自定义颜色");
    custom.setAttribute("data-bs-toggle","tooltip");
    custom.setAttribute("data-bs-placement","top");
    custom.innerHTML =
        '<input type="text" class="clr-coloris-input" data-coloris value="#000000">' +
        '<span class="color-custom-plus">+</span>';
    grid.appendChild(custom);
    for(var i=0;i<colorList.length;i++){
        var color = colorList[i];
        var colorbox = document.createElement("div");
        colorbox.setAttribute("class","colorbox");
        colorbox.setAttribute("style","background-color:"+color);
        colorbox.setAttribute("title",color);
        colorbox.setAttribute("data-bs-toggle","tooltip");
        colorbox.setAttribute("data-bs-placement","top");
        colorbox.setAttribute("onclick","changeColor('"+color+"',this);");
        grid.appendChild(colorbox);
    }

    // 初始化 Coloris 调色盘
    var customInput = custom.querySelector("input");
    Coloris({
        el: customInput,
        alpha: false,
        format: "hex",
        focusInput: false,
        selectInput: false,
        clearButton: false,
        closeButton: true,
        closeLabel: "关闭",
        clearLabel: "清除",
        swatches: [],
        onChange: function(color){
            applyCustomColor(color, custom);
        },
        onClose: function(){
            showToast("调色盘已关闭","secondary");
        }
    });
    // 点击块内任意处（含 + 号）都打开调色盘
    custom.addEventListener("click", function(e){
        if(e.target === custom || e.target.classList.contains("color-custom-plus")){
            customInput.click();
        }
    });
}


// 应用颜色到所有液体并高亮对应色块
function applyCustomColor(color, el){
    var surfaces = document.getElementsByClassName("surface");
    for(var i=0;i<surfaces.length;i++){
        surfaces[i].style.backgroundColor = color;
    }
    var boxes = document.querySelectorAll(".colorbox");
    for(var j=0;j<boxes.length;j++){
        boxes[j].classList.remove("color-active");
    }
    if(el){
        el.classList.add("color-active");
        el.style.backgroundColor = color;
    }
    //showToast("颜色已应用："+color,"primary");
}

// 根据输入的名称更新瓶子区标题：将“我的xp瓶子”中的“我”替换为用户名
function updateName(){
    var input = document.getElementById("nameInput");
    var title = document.getElementById("xpTitle");
    if(!input || !title) return;
    var name = input.value.trim();
    if(name){
        title.innerText = name + "的xp瓶子";
    }else{
        title.innerText = "我的xp瓶子";
    }
}

// 分区切换：key 为 xp_list 的键时，重建对应分区的瓶子；
// 否则视为页面跳转（如语言切换 index/indexjp）
function switchto(key){
    if(!key) return;
    if(xp_list.hasOwnProperty(key)){
        currentPart = key;
        if(deleteMode) toggleDelete(); // 退出删除模式，避免残留删除按钮
        renderBottles();
        // 同步下拉框选中状态
        var sel = document.getElementById("partSelect");
        if(sel) sel.value = key;
        showToast("已切换到分区：" + key, "info");
    }else{
        location.href = key + ".html";
    }
}

function showToast(message, type){
    type = type || "primary";
    var container = document.getElementById("toastContainer");
    if(!container) return;

    var toast = document.createElement("div");
    toast.setAttribute("class","toast align-items-center text-bg-"+type+" border-0");
    toast.setAttribute("role","alert");
    toast.setAttribute("aria-live","assertive");
    toast.setAttribute("aria-atomic","true");
    toast.innerHTML =
        '<div class="d-flex">' +
            '<div class="toast-body">'+message+'</div>' +
            '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
        '</div>';
    container.appendChild(toast);

    var t = new bootstrap.Toast(toast,{delay:2200});
    t.show();
    toast.addEventListener("hidden.bs.toast",function(){
        toast.remove();
    });
}

window.onload = function(){
    var loadingbox = document.getElementById("loadingblock");
    loadingbox.classList.add("opacity-0");
    loadingbox.style.transition = "opacity 0.5s ease";
    setTimeout(function(){
        loadingbox.remove();
        // 同步分区下拉框与当前分区
        var sel = document.getElementById("partSelect");
        if(sel) sel.value = currentPart;
        addBottles();
        addColor();
        var tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        if(typeof bootstrap !== "undefined" && bootstrap.Tooltip){
            tooltips.forEach(function(t){
                new bootstrap.Tooltip(t);
            });
        }
        showToast("加载完成，开始生成你的瓶子吧！","success");
    },500);
}