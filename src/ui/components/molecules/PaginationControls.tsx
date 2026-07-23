import React from "react";
import Button from "@components/Button";
import styles from "./PaginationControls.module.css";

interface PaginationControlsProps {
    // 0-based current page (as returned by usePagination).
    page: number;
    pageCount: number;
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
}

// Prev / Next + a "Page X of Y" indicator. Renders nothing for a single page so
// callers can hand it any pagination result without guarding themselves.
const PaginationControls: React.FC<PaginationControlsProps> = ({
    page,
    pageCount,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
}) => {
    if (pageCount <= 1) return null;

    return (
        <div className={styles.controls} data-testid="pagination-controls">
            <Button text="‹" size={1} disabled={!hasPrev} onClick={onPrev} />
            <span className={styles.indicator} aria-live="polite">
                Page {page + 1} of {pageCount}
            </span>
            <Button text="›" size={1} disabled={!hasNext} onClick={onNext} />
        </div>
    );
};

export default PaginationControls;
