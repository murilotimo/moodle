M.core_rating = {

    Y: null,
    api: M.cfg.wwwroot + '/rating/rate_ajax.php',

    init: function(Y) {
        this.Y = Y;
        Y.delegate('change', this.submit_rating, Y.config.doc.body, 'select.postratingmenu', this);
        Y.delegate('click', this.submit_rating, Y.config.doc.body, '.btnratinginput', this);

        // Hide the submit buttons
        this.Y.all('input.postratingmenusubmit').setStyle('display', 'none');
    },

    submit_rating: function(e, selectnode) {
        var theinputs = e.target.ancestor('form').all('.ratinginput');
        console.log(theinputs);
        var thedata = [];

        var inputssize = theinputs.size();
        for (var i = 0; i < inputssize; i++) {
            if (theinputs.item(i).get("name") != "returnurl") { // Dont include return url for ajax requests.
                thedata[theinputs.item(i).get("name")] = theinputs.item(i).get("value");
                console.log(theinputs.item(i).get("name"));
                console.log(theinputs.item(i).get("value"));
            }
        }

        // ESTAMOS PROCURANDO O PARAMETRO RATING, QUE É A NOTA A SER ENVIADA PELO BOTÃO
        console.log("theinputs");
        console.log(theinputs);
        console.log('thedata');
        console.log(thedata);

        var scope = this;
        var cfg = {
            method: 'POST',
            on: {
                complete: function(tid, outcome, args) {
                    try {
                        if (!outcome) {
                            alert('IO FATAL');
                            return false;
                        }

                        var data = scope.Y.JSON.parse(outcome.responseText);
                        if (data.success) {
                            // If the user has access to the aggregate then update it
                            if (data.itemid) { // Do not test data.aggregate or data.count otherwise it doesn't refresh value=0 or no value
                                var itemid = data.itemid;

                                var node = scope.Y.one('#ratingaggregate' + itemid);
                                node.set('innerHTML', data.aggregate);

                                // Empty the count value if no ratings.
                                var node = scope.Y.one('#ratingcount' + itemid);
                                if (data.count > 0) {
                                    node.set('innerHTML', "(" + data.count + ")");
                                } else {
                                    node.set('innerHTML', "");
                                }
                            }
                            return true;
                        } else if (data.error) {
                            alert(data.error);
                        }
                    } catch (e) {
                        alert(e.message + " " + outcome.responseText);
                    }
                    return false;
                }
            },
            arguments: {
                scope: scope
            },
            headers: {},
            data: build_querystring(thedata)
        };
        this.Y.io(this.api, cfg);

    }
};