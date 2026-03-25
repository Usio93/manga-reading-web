import React, { useState } from 'react';
import '../../styles/ReadPage/CommentSection.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import avatarImg from '../../assets/default_avatar.jpg';


import {useCommentsByChapterId,} from '../../hooks/commentService/useComment'; // your hook file path
import {useCreateReplyComment,useRepliesByCommentId,useCreateRootComment,} from '../../hooks/commentService/useCommentReply'; // your hook file path


import { mockComments, MockComment } from '../../mocks/useComment';

interface CommentSectionProps {
    chapterId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ chapterId }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<MockComment[]>(mockComments);
    const [expanded, setExpanded] = useState(false);

    const username = 'MockUser';

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const newId = comments.length + 1;
        const newMockComment: MockComment = {
            id: newId,
            content: newComment,
            replies: [],
        };

        setComments([newMockComment, ...comments]);
        setNewComment('');
    };

    const handleAddReply = (commentId: number, replyContent: string) => {
        const updated = comments.map(comment =>
            comment.id === commentId
                ? {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        { id: Date.now(), content: replyContent },
                    ],
                }
                : comment
        );
        setComments(updated);
    };

    const visibleComments = expanded ? comments : comments.slice(0, 3);

    return (
        <div className="comments">
            <h3>Comments</h3>
            <div className="comment-box">
        <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        />
                <button onClick={handleAddComment}>Post</button>
            </div>

            <div className="comment-list">
                {visibleComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        username={username}
                        onReply={handleAddReply}
                    />
                ))}
            </div>

            {comments.length > 3 && (
                <div className="expand-toggle">
                    <button onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Hide...' : 'Show more...'}
                    </button>
                </div>
            )}
        </div>
    );
};

interface CommentItemProps {
    comment: MockComment;
    username: string;
    onReply: (commentId: number, replyContent: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                     comment,
                                                     username,
                                                     onReply,
                                                 }) => {
    const [replyInput, setReplyInput] = useState('');
    const [expandedReply, setExpandedReply] = useState(false);

    const handleReply = () => {
        if (!replyInput.trim()) return;
        onReply(comment.id, replyInput);
        setReplyInput('');
    };

    const visibleReplies = expandedReply
        ? comment.replies
        : comment.replies.slice(0, 1);

    return (
        <div className="comment-item">
            <div className="main-comment">
                <img src={avatarImg} alt="Avatar" className="avatar" />
                <div className="comment-text">{comment.content}</div>
            </div>

            <div className="reply-list">
                {visibleReplies.map((reply) => (
                    <div key={reply.id} className="reply-item">
                        <img src={avatarImg} alt="Avatar" className="avatar small" />
                        <div className="reply-text">{reply.content}</div>
                    </div>
                ))}

                {comment.replies.length > 1 && (
                    <div className="expand-toggle reply-toggle">
                        <button onClick={() => setExpandedReply(!expandedReply)}>
                            {expandedReply ? 'Hide replies' : 'Show more replies'}
                        </button>
                    </div>
                )}
            </div>

            <div className="reply-input-box">
                <input
                    type="text"
                    placeholder="Reply..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                />
                <button onClick={handleReply}>Reply</button>
            </div>
        </div>
    );
};

export default CommentSection;
