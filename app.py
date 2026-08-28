# -*- coding: utf-8 -*-
"""
瓶子生成器 - Flask 部署脚本
默认路由 "/" 仅服务 index.html，静态资源(css/js/img/font/favicon)正常提供。
启动后访问：http://127.0.0.1:7000
"""

import os

from flask import Flask, send_from_directory, send_file

# 项目根目录（本文件所在目录）
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)


@app.route("/")
def index():
    """默认路由：仅返回 index.html"""
    return send_file(os.path.join(BASE_DIR, "index.html"))


# ---- 静态资源路由 ----
# 注意：不要把其他 html 页面(7.html 等)作为路由暴露，
# 仅提供页面渲染所必需的静态资源目录。

@app.route("/css/<path:filename>")
def css(filename):
    return send_from_directory(os.path.join(BASE_DIR, "css"), filename)


@app.route("/js/<path:filename>")
def js(filename):
    return send_from_directory(os.path.join(BASE_DIR, "js"), filename)


@app.route("/img/<path:filename>")
def img(filename):
    return send_from_directory(os.path.join(BASE_DIR, "img"), filename)


@app.route("/font/<path:filename>")
def font(filename):
    return send_from_directory(os.path.join(BASE_DIR, "font"), filename)


@app.route("/favicon.ico")
def favicon():
    return send_file(os.path.join(BASE_DIR, "favicon.ico"))


if __name__ == "__main__":
    # host=0.0.0.0 允许局域网内手机/平板访问，便于移动端测试调色盘
    app.run(host="0.0.0.0", port=7000, debug=False)
