import React from 'react';
import {Comment} from "../components/comment/comment";
import {MemeContainer} from "../components/meme-container/meme-container";

const MockMeme = {
    memePath: "https://assets.justinmind.com/wp-content/uploads/2018/11/Lorem-Ipsum-alternatives-768x492.png",
    author: "SampleUser53",
    formattedDate: "26.11.21",
    upVotes: Math.floor(Math.random() * 1000),
    downVotes: Math.floor(Math.random() * 1000),
    amountOfComments: Math.floor(Math.random() * 1000),
}

const MockComment = {
    author: "SampleAuthorOfComment43",
    date: "12.11.21",
    comment: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
}

export const MemeDetails = () => {
    return (
        <>
            <MemeContainer {...MockMeme}/>
            {new Array(100).fill(MockComment).map(comment => (
                <Comment author={comment.author} date={comment.date}>{comment.comment}</Comment>))}
        </>
    );
}

