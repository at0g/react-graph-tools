import React, { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
    aside: ReactNode,
    children: ReactNode
}

export default function Layout(props: LayoutProps) {
    const { aside, children, ...spread } = props;
    return (
        <article className={styles.Layout} {...spread}>
            <section className={styles.children}>
                {children}
            </section>

            <div className={styles.aside}>
                {aside}
            </div>
        </article>
    );
}
