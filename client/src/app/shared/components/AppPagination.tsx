import { Box, Pagination, Typography } from "@mui/material";
import { Pagination as PaginationType } from "../../models/pagination";

type Props = {
    metadata: PaginationType;
    onPageChange: (page: number) => void;
};

export default function AppPagination({ metadata, onPageChange }: Props) {
    const { currentPage, pageSize, totalCount, totalPages } = metadata;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount); // đảm bảo được sản phẩm cuối với total count

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop={3}
        >
            <Typography>
                Hiển thị {startItem}-{endItem} trong số {totalCount} sản phẩm
            </Typography>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => onPageChange(page)}
            />
        </Box>
    );
}
