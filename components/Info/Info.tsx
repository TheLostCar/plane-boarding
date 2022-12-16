import styles from './Info.module.scss';
import { MdInfoOutline } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';


const Info = () => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(o => !o);
    }

    return (
        <>

            <div className={styles.infoIconWrapper} onClick={toggle}>
                {
                    open
                    &&
                    <AiOutlineClose size={50} />
                    ||
                    <MdInfoOutline size={50} />
                }
            </div>

            <div className={`${styles.infoContainer} ${open && styles.open}`} onClick={toggle}>
                <div className={styles.infoWrapper} onClick={e => e.stopPropagation()}>
                    <h2>Info</h2>

                    <div className={styles.infoContent}>

                        <span>
                            Each group is calculated and separated into sub-arrays.<br />
                            Shuffle Subarray randomizes the order within each group.<br />
                            Reverse Subarray simply reverses the group order.<br />
                        </span>

                        <span>
                            Stowing: 5 speeds, very slow, slow, normal, fast, and very fast.<br />
                            Walking: 3 speeds slow, normal, and fast.<br />
                            Toggle their checkboxes to allow for randomized speeds.<br />
                        </span>

                        <span>
                            Inspired by
                            <a href="https://www.youtube.com/watch?v=oAHbLRjF0vo" target='_blank'> CGPGrey's great video </a>
                            on plane boarding methods.
                        </span>
                    </div>

                </div>
            </div>

        </>
    );
}

export default Info;