import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors"
import axios from 'axios';


const app = express();
const port = 4002;


app.use(cors());
app.use(bodyParser.json())

interface PostItem {
    id: string;
    title: string;
    comments: any[];
}



let posts = []

const handleEvent = (type, data) => {
    if (type === "POST_CREATED") {
        const { id, title } = data;

        posts.push({ id, title, comments: [] })
        console.log(posts)
    }

    if (type === "COMMENT_CREATED") {
        const { commentId, comments, idPost } = data;
        const currentPost = posts.filter(post => post.id === idPost)

        currentPost[0].comments.push({ id: commentId, content: comments, status: '' })
        console.log(posts)
    }

    if (type === "COMMENT_MODERATED") {
        const { commentId, comments, idPost, status } = data;
        posts.map(post => {
            if (post.id === idPost) {
                const updatedComment = post.comments.find(comment => comment.id === commentId)
                if (updatedComment) {
                    updatedComment.status = status;
                }
            }
        })

        console.log(posts)
    }
}
app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data)

    res.send({ status: "Ok" });
});


app.listen(port, async () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);

    const res = await axios.get('http://localhost:4005/events')

    for (let event of res.data) {
        console.log('Processing event:', event.type)
        handleEvent(event.type, event.data)
    }

});
