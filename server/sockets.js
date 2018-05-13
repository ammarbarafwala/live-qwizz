module.exports = (server, db) => {

    const io = require('socket.io')(server), moment = require('moment');
    let index = 0;
    let interval = null
    const results = {
        correct: 0,
        wrong: 0
    };
    let current = null;
    io.on('connection', socket => {

        socket.emit('refresh-users', db.user_list)
        // when a connection is made - load in the content already present on the server
        
        socket.on('validate', (answer, user) => {
            if (answer == current.question.answer) {
                results.correct++;
                user.points++;
            }
            else {
                results.wrong++;
            }
            io.emit("validated", user);
        });
        // demo code only for sockets + db
        // in production login/user creation should happen with a POST to https endpoint
        // upon success - revert to websockets
        socket.on('join-user', username => {

            if(db.user_list.find(user => user.username.toUpperCase() === username.toUpperCase()))
                io.emit('failed-join', {username, msg: 'Username already exists!'})
            else{
                const user = {
                    id: socket.id,
                    username,
                    avatar: `https://robohash.org/${username}`,
                    points: 0,
                    joined: new Date().getTime()
                }
                db.user_list.push(user)
                io.emit('successful-join', user)
                if(current)
                    io.emit('refresh-question', current)
                else{
                    current = { 
                        question: db.questions[index],
                        time: new Date().getTime()+10000
                    }
                    index++;
                    io.emit('refresh-question', current)
                    console.log('else')
                }
            }
        })

        socket.on('change-question', () => {
            if (index == db.questions.length)
                index = 0;
            
            current = {
                question: db.questions[index],
                time: new Date().getTime()+30000
            }
            index++;
            io.emit('refresh-question', current)
        })

        socket.on('disconnect', () => {
            db.user_list = db.user_list.filter(user => {
                return user.id != socket.id
            })
            if(!db.user_list.length){
                current = null
                clearInterval(interval)
            }
            io.emit('refresh-users', db.user_list)
        })
    })
}