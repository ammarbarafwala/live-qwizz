
module.exports = (server, db) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

        let time = null;
        let index = 0;
        let results = {
            correct : 0,
            wrong : 0
        }
        let current = null;
    io.on('connection', socket => {
        // when a connection is made - load in the content already present on the server
        
        function askQuestion(){
            results.correct = 0;
            results.wrong = 0;
            current = {
                question: db.questions[index],
                time : new Date()
            }
            io.emit('refreshQuestion', current)
            index++;
            if (index == db.questions.length) {
                index = 0;
            }

            setTimeout(function(){
                showResults();
            },15000)
        }

        function showResults(){
            io.emit("showResults", results)

            setTimeout(function(){
                askQuestion();
            },15000)
        }
        
        socket.on('answer-question', (answer, user)=>{
            if (answer == current.question.answer){
                results.correct++;
                user.points++
            } else {
                results.wrong++
            }
        })
        // demo code only for sockets + db
        // in production login/user creation should happen with a POST to https endpoint
        // upon success - revert to websockets
        socket.on('join-user', (userName) => {
            const check = db.users.filter((user)=>{
                return user.name.toLowerCase() == userName.toLowerCase()
            })
            if (check.length > 0) {
                io.emit('failed-join', {id:socket.id, message:`Username ${userName} already exists!`} )
                return;
            } else if(!new RegExp(/\S+/).test(userName)){
                io.emit('failed-join', {id:socket.id, message:`Username must include a non-whitespace character!`} )
            } else{
            const user = {
                id: socket.id,
                name: userName,
                avatar : `https://robohash.org/${userName}`,
                points :  0
            }

            db.users.push(user)

            io.emit('successfulJoin', {player: user, question: current})
        }
        })

       

        socket.on('send-message', data => {
           
        })

        socket.on('disconnect', () => {
           
        })
    })
}