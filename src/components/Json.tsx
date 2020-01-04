import React, { useMemo } from 'react';
import styles from './Json.module.css';

export default function Json(props: any) {
    const str = useMemo(
        () => JSON.stringify(props, null, 2),
        [props]
    );

    return (
        <code className={styles.Json}>
            <pre>{str}</pre>
        </code>
    )
}
