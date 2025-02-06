import { useState, useEffect, useCallback } from "react";

interface PaginationResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  loadMore: () => void;
  refreshing: boolean;
  onRefresh: () => void;
}

interface PaginationOptions<T> {
  fetchFunction: (page: number) => Promise<{
    data: T[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  }>;
  initialPage?: number;
}

export function usePagination<T>({
  fetchFunction,
  initialPage = 0,
}: PaginationOptions<T>): PaginationResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (page: number, isRefresh = false) => {
      if (isLoading || (!hasMorePages && !isRefresh)) return;

      try {
        setIsLoading(true);
        const result = await fetchFunction(page);

        setData((prevData) =>
          isRefresh ? result.data : [...prevData, ...result.data]
        );

        setCurrentPage(result.currentPage);
        setHasMorePages(result.hasNextPage);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [fetchFunction, isLoading, hasMorePages]
  );

  const loadMore = () => {
    if (hasMorePages && !isLoading) {
      fetchData(currentPage + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(0, true);
  };

  useEffect(() => {
    fetchData(initialPage);
  }, [fetchFunction]);

  return {
    data,
    isLoading,
    error,
    loadMore,
    refreshing,
    onRefresh,
  };
}
