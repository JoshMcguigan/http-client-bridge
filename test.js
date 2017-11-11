const expect = require('chai').expect;
const axios = require('axios');

const getBaseURL = function(port){
    return `http://localhost:${port}`;
};

describe('Integration Tests', function(){

    let app, GET_PORT, POST_PORT;

    before(function(){
        app = require('./server');
        GET_PORT = app.GET.server.address().port;
        POST_PORT = app.POST.server.address().port;
    });

    after(function(){
        app.close();
    })

    it('should accept a POST on any url', function(done){
        let postData = {
            tagValue: 100
        };
        axios
            .post(getBaseURL(POST_PORT)+'/test/url/stuff', postData)
            .then(function(response){
                done();
            })
            .catch(function(error){
                done(error);
            });
    });

    it('should respond with status code 404 to GET on url paths which have not been POSTed to', function(done){
        const checkResponseCode = function(response, done){
            expect(response.status).to.equal(404);
            done();
        }
        axios
            .get(getBaseURL(GET_PORT)+'/api/test/url')
            .then(function(response){
                checkResponseCode(response, done);
            })
            .catch(function(error){
                if(error.response){
                    checkResponseCode(error.response, done);
                } else {
                    done(error);
                }
            });
    });

    it('should repond with status code 200 to GET on url paths which have been POSTed to', function(done){
        let postData = {
            tagName: 100
        };
        let requestPath = '/tagName';
        axios
            .post(getBaseURL(POST_PORT)+requestPath, postData)
            .then(function(response){
                axios
                    .get(getBaseURL(GET_PORT)+'/api'+requestPath)
                    .then(function(response){
                        done();
                    })
                    .catch(function(error){
                        done(error);
                    });
            })
            .catch(function(error){
                done(error);
            });
    });

    it('should respond to GET with any data POSTed to that url path', function(done){
        let postData = {
            tagName: 100
        };
        let requestPath = '/tagName';
        axios
            .post(getBaseURL(POST_PORT)+requestPath, postData)
            .then(function(response){
                axios
                    .get(getBaseURL(GET_PORT)+'/api'+requestPath)
                    .then(function(response){
                        expect(response.data).to.deep.equal(postData);
                        done();
                    })
                    .catch(function(error){
                        done(error);
                    });
            })
            .catch(function(error){
                done(error);
            });
    });

    it('should serve static files from public folder', function(done){
        const requestPath = '/index.html';
        axios
            .get(getBaseURL(GET_PORT)+requestPath)
            .then(function(response){
                done();
            })
            .catch(function(error){
                done(error);
            });
    })
});
