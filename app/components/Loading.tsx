import { Box, Spinner, Text, Flex } from '@chakra-ui/react';

const Loading = () => {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <Spinner size="xl" mb={4} />
        <Text fontSize="xl">読み込み中...</Text>
      </Box>
    </Flex>
  );
};

export default Loading;