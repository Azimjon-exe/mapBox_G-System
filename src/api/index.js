import axios from "axios";

const getData = async () => {
    try {
        const res = await axios.get('http://localhost:3001/posts');
        return res.data;
    } catch (error) {
        console.log(error);
        return {status: "error"};
    }
}



export {getData};