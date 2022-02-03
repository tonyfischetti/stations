from flask import Flask, render_template, request


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("home.html")

@app.route('/den2', methods=['GET'])
def microblog2():
    chain       = request.args.get('chain', default="avalanche", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0x0C1947fE1233F6DCD15410e6a6C852476315c8F5")
    return render_template("microblog-2.html",
                           chain=chain,
                           contract=con_address)

@app.route('/den3', methods=['GET'])
def microblog3():
    chain       = request.args.get('chain', default="polygon", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0x7f683b3aa22a0fc7a70e0685d2ae8c2fcf02e5fe")
    return render_template("microblog-3.html",
                           chain=chain,
                           contract=con_address)

@app.route('/den4', methods=['GET'])
def microblog4():
    chain       = request.args.get('chain', default="polygon", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0x7f683b3aa22a0fc7a70e0685d2ae8c2fcf02e5fe")
    sver        = request.args.get('version', default="v4", type=str)
    return render_template("microblog-4.html",
                           chain=chain,
                           contract=con_address,
                           version=sver)

# 5
@app.route('/den5', methods=['GET'])
def microblog5():
    chain       = request.args.get('chain', default="polygon", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0xd1BE11D17d103A979080b7620B0AA1AF09D430D8")
    sver        = request.args.get('version', default="v5", type=str)
    debug_p     = request.args.get('debug', default="false", type=str)
    return render_template("microblog-5.html",
                           chain=chain,
                           contract=con_address,
                           version=sver,
                           debug=debug_p)

@app.route('/den5', methods=['GET'])
def currentden5():
    chain       = request.args.get('chain', default="polygon", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0xd1BE11D17d103A979080b7620B0AA1AF09D430D8")
    sver        = request.args.get('version', default="v5", type=str)
    debug_p     = request.args.get('debug', default="false", type=str)
    return render_template("microblog-5.html",
                           chain=chain,
                           contract=con_address,
                           version=sver,
                           debug=debug_p)

@app.route('/thats-my-jam', methods=['GET'])
def currentjam5():
    chain       = request.args.get('chain', default="fantom", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0xaCA49a698Fd9Ae5721b4781a7C03382639a88688")
    sver        = request.args.get('version', default="v5", type=str)
    debug_p     = request.args.get('debug', default="false", type=str)
    return render_template("microblog-5.html",
                           chain=chain,
                           contract=con_address,
                           version=sver,
                           debug=debug_p)


@app.route('/bikini-atoll', methods=['GET'])
def bikini_atoll():
    chain       = request.args.get('chain', default="harmony", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0x1b1f9e1227aae2a67f03955f222d7642e2ba1720")
    sver        = request.args.get('version', default="v6", type=str)
    debug_p     = request.args.get('debug', default="true", type=str)
    return render_template("microblog-6.html",
                           chain=chain,
                           contract=con_address,
                           version=sver,
                           debug=debug_p)


@app.route('/tune', methods=['GET'])
def tune():
    chain       = request.args.get('chain', default="harmony", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0xd63b063df87e53a60feca6001375977d66f54083")
    sver        = request.args.get('version', default="v6", type=str)
    debug_p     = request.args.get('debug', default="false", type=str)
    return render_template("microblog-6.html",
                           chain=chain,
                           contract=con_address,
                           version=sver,
                           debug=debug_p)


# pinned (version 6)
@app.route('/den-of-understanding', methods=['GET'])
def currentden6():
    chain       = request.args.get('chain', default="harmony", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0xd63b063df87e53a60feca6001375977d66f54083")
    sver        = request.args.get('version', default="v6", type=str)
    debug_p     = request.args.get('debug', default="false", type=str)
    return render_template("microblog-6.html",
                           chain=chain,
                           contract=con_address,
                           version=sver,
                           debug=debug_p)






@app.route('/add-network')
def add_network():
    return render_template("add-network.html")


if __name__ == "__main__":
    app.run(ssl_context=('fullchain.pem', 'privkey.pem'))


