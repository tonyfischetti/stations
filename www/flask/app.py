from flask import Flask, render_template, request


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("home.html")

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


@app.route('/bikini-atoll', methods=['GET'])
def bikini_atoll():
    chain       = request.args.get('chain', default="harmony", type=str)
    con_address = request.args.get('address', type=str,
                                   default="0x1b1f9e1227aae2a67f03955f222d7642e2ba1720")
    sver        = request.args.get('version', default="v6", type=str)
    debug_p     = request.args.get('debug', default="galse", type=str)
    return render_template("microblog.html",
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
    return render_template("microblog.html",
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
    return render_template("microblog.html",
                           chain=chain,
                           contract=con_address,
                           version=sver,
                           debug=debug_p)






@app.route('/add-network')
def add_network():
    return render_template("add-network.html")


if __name__ == "__main__":
    app.run(ssl_context=('fullchain.pem', 'privkey.pem'))


