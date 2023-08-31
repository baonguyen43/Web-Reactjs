/* eslint-disable quotes */
import Axios from 'axios';
import React from 'react';
import _ from 'lodash';
import { Affix } from 'antd';
import Loading from 'components/Loading';
import { Button, ListGroupItem, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import CardHeader from 'reactstrap/lib/CardHeader';
import styles from './pagesStyles.module.css'
import NotData from 'components/Error/NotData';

const axiosClient = Axios.create({
  baseURL: 'https://cloud.softech.cloud/mobile/ames/api',
  headers: {
    AppName: 'APP_MY_AMES',
    'Content-Type': 'application/json',
    // 'secret-token': 'D8284EE5CEAAEB77281A983B5141D',
  },
});

const AudioFiles = () => {
  const [state, setState] = React.useState({
    temp: 0,
    audio: null,
    files: [],
    folders: null,
    currentId: 0,
    previousId: [],
    names: [],
  })

  const getFiles = React.useCallback(async (id) => {
    const res = await axiosClient.get(`/folders/${id}/files`)
    return res.data.files;
  }, [])

  const getFolders = React.useCallback(async (id, back, name, items) => {
    const res = await axiosClient.get(`/folders/${id ?? items.id}`);
    let { currentId, previousId, names } = state;
    let folders = res.data.folders;
    let files = [];
    if (items) {
      if (currentId === items.id) {
        return
      }
      currentId = items.id;
      previousId = previousId.slice(0, items.index)
      names = names.slice(0, items.index + 1)
    } else {
      if (back) {
        currentId = id;
        previousId.pop()
        names.pop()
      } else {
        if (currentId) {
          previousId.push(currentId);
        }
        currentId = id
        names.push({ id: currentId, name })
      }
    }


    if (folders.length === 0) {
      files = await getFiles(id)
    }

    folders = _.sortBy(folders, ['name'])

    setState((prevState) => ({
      ...prevState,
      names,
      files,
      folders,
      currentId: currentId,
      previousId: previousId,
      audio: back ? null : prevState.audioUrl,
    }))
  }, [getFiles, state])

  const renderFolders = React.useCallback((item, index) => {
    return (
      <div key={index} onClick={() => getFolders(item.id, false, item.name)} style={{ margin: 10, cursor: 'pointer' }}>
        <ListGroupItem
          // color="success"
          style={{ padding: 10 }}
        >
          <i className="fas fa-folder-open mx-2"></i> {item.name}
        </ListGroupItem>
      </div>
    )
  }, [getFolders])

  const getAudio = React.useCallback((item) => {
    const audio = {
      url: item.url,
      name: item.url.split('/').pop(),
    }
    setState((prevState) => ({ ...prevState, audio }))
  }, [])

  const renderFiles = React.useCallback((item, index) => {
    return (
      <div key={index} onClick={() => getAudio(item)} style={{ margin: 10, cursor: 'pointer' }}>
        <ListGroupItem
          style={{ padding: 10 }}
        // color="success"
        >
          <i className="fas fa-headphones-alt mx-2"></i> {item.name}
        </ListGroupItem>
      </div>
    )
  }, [getAudio])

  const getAllFolders = React.useCallback(() => {
    axiosClient.get('/folders').then((res) => {
      const filter = res.data.folders.filter(x => x.parentId === 0 || x.parentId === null);
      const folders = _.sortBy(filter, ['name'])
      setState((prevState) => ({ ...prevState, folders, files: [], previousId: [], currentId: 0, names: [], audio: null }))
    }).catch((error) => {
      console.log("🚀 ~ file: AudioFile.js ~ line 101 ~ axiosClient.get ~ error", error)
    })
  }, [])

  const renderAudio = React.useCallback((audio) => {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ fontWeight: 600 }}>
          <i className="fas fa-music"></i>
          <span className="mx-2">{audio.name}</span>
        </div>
        <audio className={styles.audio} controls autoPlay src={`https://cloud.softech.cloud/admin${audio.url}`}>
          Your browser does not support the audio element.</audio>
      </div>
    )
  }, [])

  React.useEffect(() => {
    getAllFolders()
  }, [getAllFolders])

  if (!state.folders) return <Loading />
  let previousId = state.previousId[state.previousId.length - 1];
  return (
    <div className="m-4">
      <CardHeader className="d-flex" style={{ background: '#022F63', color: 'white' }}>
        <div>
          {
            state.currentId > 0 &&
            <Button className="btn-sm" onClick={() => previousId ? getFolders(previousId, true) : getAllFolders()}>
              <i className="fas fa-arrow-left"></i>
            </Button>
          }
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 20 }}>THƯ VIỆN FILE NGHE</div>
        <div></div>
      </CardHeader>
      <div style={{ marginTop: 10 }}>
        <Breadcrumb tag="nav" listClassName={styles.breadcumb} listTag="div">
          <BreadcrumbItem tag="a" className="text-primary my-2" onClick={getAllFolders}>Home</BreadcrumbItem>
          {
            state.names.map((item, index) => {
              return <BreadcrumbItem
                tag="a"
                key={item.id}
                className="text-blue my-2"
                onClick={() => getFolders(null, false, null, { ...item, index })}
              >{item.name}
              </BreadcrumbItem>
            })
          }
        </Breadcrumb>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {
          state.audio &&
          <Affix offsetTop={10}>
            {renderAudio(state.audio)}
          </Affix>
        }
      </div>
      <div >
        {state.folders.length > 0 && state.folders.map(renderFolders)}
        {state.files.length > 0 && state.files.map(renderFiles)}
        {state.folders.length === 0 && state.files.length === 0 && <NotData />}
      </div>
    </div>
  );
}

export default AudioFiles;
