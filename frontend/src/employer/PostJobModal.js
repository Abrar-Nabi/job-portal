import React from "react";
import PostJobForm from "./PostJobForm";
import "./styles/PostJobModal.css";

const PostJobModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <PostJobForm />
      </div>
    </div>
  );
};

export default PostJobModal;
