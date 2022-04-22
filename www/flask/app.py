from flask import Flask, render_template, request, Response


app = Flask(__name__)


DEFAULT_CHAIN = "harmony"
DEFAULT_CONTRACT = "0xd63b063df87e53a60feca6001375977d66f54083"




@app.route('/')
def index():
    htmllang = request.args.get('lang', default="en", type=str)
    return render_template("home.html", htmllang=htmllang)

@app.route('/bfip')
def bfip():
    htmllang = request.args.get('lang', default="en", type=str)
    return render_template("bfip.html", htmllang=htmllang)

@app.route('/debug-info')
def debug_info():
    htmllang = request.args.get('lang', default="en", type=str)
    return render_template("debug-info.html", htmllang=htmllang,
                           user_agent=request.headers.get('User-Agent'),
                           all_headers=request.headers)


@app.route('/service-worker.js')
def dapp_service_worker():
    content = "this should be replaced"
    with open("./static/js/service-worker.js") as fh:
        content = fh.read()
    r = Response(response=content,
                 status=200,
                 mimetype="text/javascript")
    r.headers["Content-Type"] = "text/javascript; charset=utf-8"
    return r


@app.route('/tune', methods=['GET'])
def tune():
    chain       = request.args.get('chain', default=DEFAULT_CHAIN, type=str)
    con_address = request.args.get('address', type=str,
                                   default=DEFAULT_CONTRACT)
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain=chain,
                           contract=con_address, debug=debug_p,
                           scrollto=scrollto)


# pinned (version 6)
# CURRENT DEN
@app.route('/den-of-understanding', methods=['GET'])
def current_den6():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           # contract="0xd63b063df87e53a60feca6001375977d66f54083",
                           contract="0x1a7c04d9932f3FF7Fe0a9835A936D538968818f6",
                           debug=debug_p, scrollto=scrollto)

@app.route('/thats-my-jam', methods=['GET'])
def current_jam():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           contract="0x9766E541938d8a64c60804ea56d0F419c0E9c013",
                           debug=debug_p, scrollto=scrollto)


@app.route('/stations-updates', methods=['GET'])
def station_updates():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           # contract="0xC016d44bd9189244e2F16b072dcb5a256469abEa", # polygon
                           contract="0xfF6e4B0149628463bCF958709c964ae884dcaF6a",
                           debug=debug_p, scrollto=scrollto)

@app.route('/the-lotus-eaters', methods=['GET'])
def the_lotus_eaters():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           # contract="0x28512558CdA1C66c80Eb994Cb2F6b97Adbb7f4d3",
                           # contract="0x9E0A88b325776c82C3E33a867d7C654439346636",
                           contract="0x066BF361DDcB8b2E35A2a9eb973CDb0EF138220A",
                           debug=debug_p, scrollto=scrollto)


@app.route('/bikini-atoll', methods=['GET'])
def bikini_atoll():
    debug_p     = request.args.get('debug', default="true", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="polygon",
                           # contract="0x1b1f9e1227aae2a67f03955f222d7642e2ba1720", # harmony?
                           contract="0x921262b4e1eb955163E259940d3A96D670704DF6",
                           debug=debug_p, scrollto=scrollto)

@app.route('/trinity-nm', methods=['GET'])
def trinity_nm():
    debug_p     = request.args.get('debug', default="true", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           contract="0xf125Add65d96B6568974f7a5C76086b1ab529E36",
                           debug=debug_p, scrollto=scrollto)


@app.route('/arsenic!', methods=['GET'])
def arsenic_pinned():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           # contract="0x82419640d0fcc1bedaf4c3875b29be202bf0cce3",
                           contract="0x460B9aDea3B0Bf5b81e087bc9F6271f99F814Cbb",
                           debug=debug_p, scrollto=scrollto)


@app.route('/coldbrew-princess', methods=['GET'])
def coldbrew_princess():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           # contract="0xf457F1dfa200d84D40b2aB41937a02accd4689a9",
                           contract="0x136F09ae688455e8B9f9649BaE8A51010638E1f6",
                           debug=debug_p, scrollto=scrollto)




@app.route('/add-network')
def add_network():
    htmllang = request.args.get('lang', default="en", type=str)
    return render_template("add-network.html",
                           htmllang=htmllang)

@app.route('/tmp-instructions')
def tmp_instructions():
    htmllang = request.args.get('lang', default="en", type=str)
    return render_template("tmp-instructions.html",
                           htmllang=htmllang)


if __name__ == "__main__":
    app.run(ssl_context=('fullchain.pem', 'privkey.pem'))


