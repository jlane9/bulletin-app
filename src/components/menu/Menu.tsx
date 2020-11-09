import axios, {AxiosResponse} from 'axios';
import {
    IonAlert,
    IonButton,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonRow,
    IonToast
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useLocation}  from 'react-router-dom';
import { TTopic } from '../../api/topic';
import './Menu.css';


export type TTopicList = TTopic[];

const Menu: React.FC = (props) => {

    const location = useLocation();
    const [topics, setTopics] = useState<TTopicList>([]);
    const [isTopicError, setTopicError] = useState<boolean>(false);
    const [isCreateError, setCreateError] = useState<boolean>(false);
    const [isLoginError, setIsLoginError] = useState<boolean>(false);
    const [showAddTopic, setShowAddTopic] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [showSignup, setShowSignup] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<string>(localStorage.getItem('authToken') || '');

    useEffect(() => {
        getTopicList();
    }, [authToken]);

    function updateAuthToken(value: string) {
        setAuthToken(value);
        localStorage.setItem('authToken', value);
    }

    function getTopicList() {

        if (!authToken) {
            return;
        }

        return axios.get('/api/topics/', {headers: {'Authorization': `JWT ${authToken}`}})
            .then((response: AxiosResponse) => {
                setTopics(response.data.results);
            }).catch(() => {
                setTopics([]);
                setTopicError(true);
            });
    }

    function newTopic(data: any) {

        if (!authToken) {
            return;
        }

        return axios.post('/api/topics/', data, {headers: {'Authorization': `JWT ${authToken}`}})
            .then(() => { getTopicList(); })
            .catch(() => {
                setCreateError(true);
            });
    }

    function login(data: any) {
        return axios.post('/api-token-auth/', data)
            .then((response: AxiosResponse) => {
                updateAuthToken(response.data.token);
            })
            .catch(() => {
                setIsLoginError(true);
            });
    }

    function signup(data: any) {
        return axios.post('/api/users/', data)
            .then(() => { login(data); })
            .catch(() => {
                setIsLoginError(true);
            });
    }

    function logout() {
        updateAuthToken('');
        setTopics([]);
    }

    return (
        <IonMenu contentId="main" type="overlay">
            <IonContent>
                { authToken
                    ? <IonList id="topic-list">
                        <IonListHeader>Bulletin</IonListHeader>
                        {topics.map((topic: TTopic, index: number) => {
                            return (
                                <IonMenuToggle key={index} autoHide={false}>
                                    <IonItem className={location.pathname === "/topic/" + topic.id ? 'selected' : ''}
                                             routerLink={"/topic/" + topic.id} routerDirection="none" lines="none"
                                             detail={false}>
                                        <IonLabel>{topic.name}</IonLabel>
                                    </IonItem>
                                </IonMenuToggle>
                            );
                        })}
                        <IonButton id="addTopicButton" expand='block' onClick={() => setShowAddTopic(true)}>
                            <IonIcon icon={addCircleOutline}/>&nbsp;Add Topic
                        </IonButton>
                    </IonList>
                    : <IonList>
                        <IonListHeader>Bulletin</IonListHeader><IonGrid>
                        <IonRow>
                            <IonCol>
                                Please login or signup first
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    </IonList>

                }
            </IonContent>
            <IonFooter>
                <IonGrid>
                    { authToken
                        ? <IonRow>
                            <IonCol className="ion-align-self-center">
                                <IonButton expand="block" type="submit" onClick={logout}>Logout</IonButton>
                            </IonCol>
                        </IonRow>
                        : <IonRow>
                            <IonCol className="ion-align-self-center" size="6">
                                <IonButton expand="block" type="submit" onClick={() => setShowLogin(true)}>Login</IonButton>
                            </IonCol>
                            <IonCol className="ion-align-self-center" size="6">
                                <IonButton expand="block" type="submit" onClick={() => setShowSignup(true)}>Signup</IonButton>
                            </IonCol>
                        </IonRow>
                    }
                </IonGrid>
            </IonFooter>
            <IonToast isOpen={isTopicError} message="Error: Unable to load topics. Please refresh" duration={2000}
                      color="danger"/>
            <IonToast isOpen={isCreateError} message="Error: Unable to create topic. Please try logging back in" duration={2000}
                      color="danger"/>
            <IonToast isOpen={isLoginError} message="Error: Unable to login" duration={2000}
                      color="danger"/>
            <IonAlert
                isOpen={showAddTopic}
                onDidDismiss={() => setShowAddTopic(false)}
                header={'Topic name'}
                inputs={[
                    {
                        name: 'name',
                        type: 'text',
                        placeholder: 'My new topic'
                    }
                ]}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Ok',
                        handler: newTopic
                    }
                ]}
            />
            <IonAlert
                isOpen={showLogin}
                onDidDismiss={() => setShowLogin(false)}
                header={'Login'}
                inputs={[
                    {
                        name: 'username',
                        type: 'text',
                        placeholder: 'Username'
                    },
                    {
                        name: 'password',
                        type: 'password',
                        placeholder: 'Password'
                    }
                ]}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Ok',
                        handler: login
                    }
                ]}
            />
            <IonAlert
                isOpen={showSignup}
                onDidDismiss={() => setShowSignup(false)}
                header={'Signup'}
                inputs={[
                    {
                        name: 'username',
                        type: 'text',
                        placeholder: 'Username'
                    },
                    {
                        name: 'password',
                        type: 'password',
                        placeholder: 'Password'
                    }
                ]}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Ok',
                        handler: signup
                    }
                ]}
            />
        </IonMenu>
    );
};

export default Menu;
