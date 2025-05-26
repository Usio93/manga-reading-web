import React, { useState } from 'react';
import '../../styles/ReadPage/CommentSection.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import avatarImg from '../../assets/default_avatar.jpg';


import {useCommentsByChapterId, useCreateComment,} from '../../hooks/commentService/useComment'; // your hook file path
import {useCreateReplyComment,useRepliesByCommentId,} from '../../hooks/commentService/useCommentReply'; // your hook file path



interface CommentSectionProps {
    chapterId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ chapterId }) => {
    const [newComment, setNewComment] = useState('');
    const [expanded, setExpanded] = useState(false);
    const username = useSelector((state: RootState) => state.user.profile?.name || 'Anonymous');

    const { data, isLoading } = useCommentsByChapterId(chapterId);
    const comments = data?.result || [];

    const createCommentMutation = useCreateComment(['comments', 'chapter', chapterId]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        createCommentMutation.mutate({
            chapterId,
            content: newComment,
        });
        setNewComment('');
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
                <button onClick={handleAddComment} disabled={createCommentMutation.isPending}>
                    {createCommentMutation.isPending ? 'Loading...' : 'Post'}
                </button>
            </div>

            <div className="comment-list">
                {isLoading ? (
                    <p>Đang tải bình luận...</p>
                ) : (
                    visibleComments.map((comment: any) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            chapterId={chapterId}
                            username={username}
                        />
                    ))
                )}
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

const CommentItem: React.FC<{
    comment: { id: number; content: string };
    chapterId: number;
    username: string;
}> = ({ comment, chapterId, username }) => {
    const [replyInput, setReplyInput] = useState('');
    const [expandedReply, setExpandedReply] = useState(false);

    const { data: repliesData } = useRepliesByCommentId(String(comment.id));
    const replies = repliesData?.result || [];

    const createReplyMutation = useCreateReplyComment(['comments', 'chapter', chapterId]);

    const handleReply = () => {
        if (!replyInput.trim()) return;
        createReplyMutation.mutate({
            parentId: comment.id.toString(),
            content: replyInput,
            username,
        });
        setReplyInput('');
    };

    const visibleReplies = expandedReply ? replies : replies.slice(0, 1);

    return (
        <div className="comment-item">
            <div className="main-comment">
                <img src={avatarImg} alt="Avatar" className="avatar"/>

                <div className="comment-text">{comment.content}</div>
            </div>

            <div className="reply-list">
                {visibleReplies.map((reply: any) => (
                    <div key={reply.id} className="reply-item">
                        <img src={avatarImg} alt="Avatar"  className="avatar small" />
                        <div className="reply-text">{reply.content}</div>
                    </div>
                ))}

                {replies.length > 1 && (
                    <div className="expand-toggle reply-toggle">
                        <button onClick={() => setExpandedReply(!expandedReply)}>
                            {expandedReply ? 'Hide reply..' : 'Show more reply..'}
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
                <button onClick={handleReply} disabled={createReplyMutation.isPending}>
                    {createReplyMutation.isPending ? 'Đang gửi...' : 'Reply'}
                </button>
            </div>
        </div>
    );
};

export default CommentSection;
