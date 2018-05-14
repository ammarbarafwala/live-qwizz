module.exports = (server, db) => {

    const io = require('socket.io')(server), moment = require('moment');

    let index = 0,
        current = null,
        result = {
            'a': 0,
            'b': 0,
            'c': 0,
            'n': 0
        }
    const delay = 30000
    
    io.on('connection', socket => {

        // when a connection is made - load in the content already present on the server

        const getCurrentTime = () => new Date().getTime()

        const initializeData = () => {
            
            if(!current){
                result = {
                    'a': 0,
                    'b': 0,
                    'c': 0,
                    'n': 0
                }
                if (index >= db.questions.length)
                    index = 0
                current = {
                    question: db.questions[index],
                    time: getCurrentTime() + delay
                }
                console.log('index')
                index++
            }
            return current
        }
        
        socket.on('validate', (user) => {
            result[user.answer]+=1
            io.emit("display-results", {result, username: user.username});
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
                    answer: 'n'
                }
                db.user_list.push(user)
                io.emit('successful-join', {user, current: initializeData()})
            }
        })

        socket.on('change-question', (username) => {
            if(current && current.time < getCurrentTime())
                current = null
            io.emit('refresh-question', initializeData())
        })

        socket.on("get-questions", ()=>{
            io.emit("refresh-question-list", db.questions)
        })

        socket.on("update-questions", (question)=>{
            db.questions.push(question)
            io.emit("refresh-question-list", db.questions)
        })

        socket.on("remove-question", (id)=>{
            db.questions = db.questions.filter(q=>{
                return q.id != id;
            })
            io.emit("refresh-question-list", db.questions)
        })

        socket.on('disconnect', () => {
            db.user_list = db.user_list.filter(user => {
                return user.id != socket.id
            })
            if(!db.user_list.length){
                current = null
            }
        })
    })
}