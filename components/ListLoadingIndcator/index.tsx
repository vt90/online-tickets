import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

const variants = [
    'h2',
    'h3',
    'body1',
    'caption',
] as readonly TypographyProps['variant'][];

const ListLoadingIndicator = () => {
    return (
        <div>
            {variants.map((variant) => (
                <Typography component="div" key={variant} variant={variant}>
                    <Skeleton />
                </Typography>
            ))}
        </div>
    );
}

export default ListLoadingIndicator;
