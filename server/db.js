const questions = [
    {
        id : 1,
        question : "What is 5 times 2",
        options : 
            {
                a : 1,
                b : 2,
                c : 10,
            },
        
        answer : 'c'

    },
    {
        id : 2,
        question : "What is 5 times 3",
        options : 
            {
                a : 15,
                b : 20,
                c : 10,
            },
        
        answer : 20

    },
    {
        id : 3,
        question : "What is 15 times 2",
        options : 
            {
                a : 5,
                b : 30,
                c : 10,
            },
        
        answer : 'b'

    },
    {
        id : 4,
        question : "What is 2 times 2",
        options : 
            {
                a : 1,
                b : 2,
                c : 4,
            },
        
        answer : 'c'

    },
    {
        id : 5,
        question : "What is 3 times 3",
        options : 
            {
                a : 9,
                b : 6,
                c : 12,
            },
        
        answer : 'a'

    }
    
]

const user_list = []

module.exports = {
    questions,
    user_list
}