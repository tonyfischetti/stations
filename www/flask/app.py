from flask import Flask, render_template, request


app = Flask(__name__)

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

# @app.route('/thats-my-jam', methods=['GET'])
# def currentjam5():
#     chain       = request.args.get('chain', default="fantom", type=str)
#     con_address = request.args.get('address', type=str,
#                                    default="0xaCA49a698Fd9Ae5721b4781a7C03382639a88688")
#     sver        = request.args.get('version', default="v5", type=str)
#     debug_p     = request.args.get('debug', default="false", type=str)
#     return render_template("microblog-5.html",
#                            chain=chain,
#                            contract=con_address,
#                            version=sver,
#                            debug=debug_p)


@app.route('/tune', methods=['GET'])
def tune():
    chain       = request.args.get('chain', default="harmony", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0xd63b063df87e53a60feca6001375977d66f54083")
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain=chain,
                           contract=con_address, debug=debug_p,
                           scrollto=scrollto)


# pinned (version 6)
@app.route('/den-of-understanding', methods=['GET'])
def currentden6():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           contract="0xd63b063df87e53a60feca6001375977d66f54083",
                           debug=debug_p, scrollto=scrollto)

@app.route('/stations-updates', methods=['GET'])
def station_updates():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="polygon",
                           contract="0xC016d44bd9189244e2F16b072dcb5a256469abEa",
                           debug=debug_p, scrollto=scrollto)

@app.route('/the-lotus-eaters', methods=['GET'])
def the_lotus_eaters():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           contract="0x5F8ccfF7c31245564d0FdA3a4387Bb03B925776C",
                           debug=debug_p, scrollto=scrollto)


@app.route('/bikini-atoll', methods=['GET'])
def bikini_atoll():
    debug_p     = request.args.get('debug', default="true", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           contract="0x1b1f9e1227aae2a67f03955f222d7642e2ba1720",
                           debug=debug_p, scrollto=scrollto)

@app.route('/bikini-atoll-import', methods=['GET'])
def bikini_atoll_import():
    debug_p     = request.args.get('debug', default="true", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           contract="0xD47cd25ef74C908A96bF8647893D14B97636b0B4",
                           debug=debug_p, scrollto=scrollto)


@app.route('/arsenic!', methods=['GET'])
def arsenic_pinned():
    debug_p     = request.args.get('debug', default="false", type=str)
    scrollto    = request.args.get('scrollto', default=None, type=str)
    return render_template("microblog.html", chain="harmony",
                           contract="0x82419640d0fcc1bedaf4c3875b29be202bf0cce3",
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


