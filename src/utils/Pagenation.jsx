import React from 'react'

const Pagenation = ({ currentPage, setCurrentPage, totalPages }) => {
    return (
        <div className='mt-2 d-flex justify-content-end align-items-center'>
            <button className='pageButton' disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}>
                Prev
            </button>
            <span className='f-14p'> Page {currentPage} of {totalPages} </span>
            <button className='pageButton ms-1' disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}>
                Next
            </button>
        </div>
    )
}

export default Pagenation
