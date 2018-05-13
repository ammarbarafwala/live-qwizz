module.exports = (server, db) => {

    const io = require('socket.io')(server), moment = require('moment');
    let index = 0;
    let interval = null
    let result = {
        'a': 0,
        'b': 0,
        'c': 0,
        'n': 0
    }
    let current = null;
    io.on('connection', socket => {

        // when a connection is made - load in the content already present on the server
        
        socket.on('validate', (user) => {
            result[user.answer]+=1
            console.log('validate')

            io.emit("display-results", result);
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
                    joined: new Date().getTime(),
                    answer: 'n'
                }
                db.user_list.push(user)
                io.emit('successful-join', user)
                if(current){
                    current.username = username
                    io.emit('refresh-question', current)
                }
                else{
                    current = {
                        username,
                        question: db.questions[index],
                        time: new Date().getTime()+30000
                    }
                    index++;
                    io.emit('refresh-question', current)
                    console.log('else')
                    console.log(db.user_list)
                }
            }
        })

        socket.on('change-question', (username) => {
            if (index >= db.questions.length)
                index = 0;
            result = {
                'a': 0,
                'b': 0,
                'c': 0,
                'n': 0
            }
            current = {
                username,
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