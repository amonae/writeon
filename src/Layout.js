import React, { useContext, useRef } from 'react';
import styles from './layout.module.scss';
import {
  Box,
  Button,
  Center,
  createStandaloneToast,
  Divider,
  IconButton,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { generatePath } from 'react-router';
import { Redirect } from 'react-router-dom';
import { NewPostContext } from './contexts/NewPostContext';
import { SearchContext } from './contexts/SearchContext';
import { Header } from './components/Header';
import writeOn from './components/Header/writeon.svg';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from './gql.js';

export function Layout({ children }) {
  const createPostErrorToast = useToast();
  const { setNewPost } = useContext(NewPostContext);
  const { setSearchInput, setSearchBarFocused } = useContext(SearchContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const postTitleInput = useRef();
  const [
    createPost,
    { error: createPostError, loading, data, called }
  ] = useMutation(CREATE_POST, {
    onCompleted: (createPost) => {
      onClose();
      setNewPost({ id: createPost.createPost._id });
    }
  });

  async function createNewPost() {
    //todo: check post length. if too long or short, do yo thang and show them errors
    //todo: throw in an OnChange. if title length is < x, disable the button. but once long enough, enable the "Create note" button
    const newTitle = postTitleInput.current.value.toString();

    createPost({ variables: { title: newTitle } });

    // if (createPostError) {
    //   return createPostErrorToast({
    //     title: 'An error has occurred.',
    //     description: 'There was an issue creating your note. Please try again.',
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true
    //   });
    // }
  }

  function handleInput(e) {
    setSearchInput(e.target.value);
  }

  //todo: change the localhost 3000 link here and everywhere else in the code

  //todo: put a toast inside the create new note modal when there's an error instead?
  //todo: well actually, put some sort of check/input validation on the input FIRST

  return (
    <>
      {called && data && (
        <Redirect
          push
          to={generatePath('/write/:id', {
            id: data.createPost._id
          })}
        />
      )}
      <Header className={styles['header']}>
        <Box as="a" href="http://localhost:3000/" className="logo">
          <img src={writeOn} className={styles['writeon']} />
        </Box>
        <InputGroup width="50%">
          <Input
            placeholder="Search"
            bg="#efefef"
            border="none"
            width="100%"
            maxW="1000px"
            m="0 auto"
            size="lg"
            onChange={(e) => handleInput(e)}
            onFocus={() => setSearchBarFocused(true)}
            onBlur={() => setSearchBarFocused(false)}
            _focus={{
              backgroundColor: '#ffffff',
              shadow: 'xs'
            }}
          />
        </InputGroup>
        <Box>
          <IconButton
            aria-label="Create New Note"
            title="Create New Note"
            isRound
            icon={<HiOutlinePencilAlt />}
            onClick={onOpen}
          />
        </Box>
      </Header>
      <div className={styles['container']}>{children}</div>

      <Modal
        size="sm"
        initialFocusRef={postTitleInput}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Note</ModalHeader>
          <Divider style={{ width: '90%', margin: '0 auto' }} />
          <ModalCloseButton />
          <ModalBody>
            <div style={{ marginTop: '1rem' }}>
              {!loading ? (
                <div>
                  <p>Title</p>
                  <Input ref={postTitleInput} size="lg" />

                  {createPostError && (
                    <p>
                      There was an error creating your note. Please try again.
                    </p>
                  )}
                </div>
              ) : (
                <Center>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    color="#9e9e9e"
                    size="xl"
                  />
                </Center>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => createNewPost()} colorScheme="blue">
              Create Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function CreateNewLayout(props) {
  return (
    <>
      <div className={styles['wrapper']}>{props.children}</div>
    </>
  );
}
