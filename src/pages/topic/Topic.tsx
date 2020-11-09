import axios, { AxiosResponse } from 'axios';
import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonMenuButton,
    IonRow,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { sendOutline } from 'ionicons/icons';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Moment from 'react-moment';
import { useParams } from 'react-router';
import { TMessage } from '../../api/message';
import { TTopic } from '../../api/topic';
import './Topic.css';


export type TMessageList = TMessage[];

const Topic: React.FC = () => {

    const {topic_id} = useParams<{ topic_id: string; }>();
    const [topic, setTopic] = useState<TTopic>();
    const [messages, setMessages] = useState<TMessageList>([]);
    const {register, handleSubmit, reset} = useForm();

    useEffect(() => {
        getTopic(topic_id);
        getMessagesByTopic(topic_id);
    }, [topic_id]);

    function getAuthToken() {
        return localStorage.getItem('authToken') || '';
    }

    function getTopic(id: string) {

        let authToken = getAuthToken();
        axios.get(`/api/topics/${id}/`, {headers: {'Authorization': `JWT ${authToken}`}})
            .then((response: AxiosResponse) => {
                setTopic(response.data);
            }).catch(() => {
        });
    }

    function getMessagesByTopic(id: string) {
        let authToken = getAuthToken();
        axios.get(`/api/topics/${id}/messages/`, {headers: {'Authorization': `JWT ${authToken}`}})
            .then((response: AxiosResponse) => {
                setMessages(response.data.results.reverse());
            }).catch(() => {
        });
    }

    function sendMessage(data: any) {
        let authToken = getAuthToken();
        axios.post(`/api/topics/${topic_id}/new_message/`, data, {headers: {'Authorization': `JWT ${authToken}`}})
            .then((response: AxiosResponse) => {
                getMessagesByTopic(topic_id);
                reset({content: ''});
            }).catch(() => {
        });
    }

    return (
        <IonPage>
            {topic &&
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle>{topic.name}</IonTitle>
                    </IonToolbar>
                </IonHeader>
            }
            <IonContent fullscreen>
                {topic &&
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle>{topic.name}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                }
                {messages.map((message: TMessage, index: number) => {
                    return (
                        <IonCard key={index}>
                            <IonCardHeader>
                                <IonItem lines="none">
                                    <IonCardTitle>{message.creator.username}</IonCardTitle>
                                    <IonCardSubtitle slot="end">
                                        {moment.duration(moment().diff(moment(message.created))).hours() < 1
                                            ? <Moment fromNow={true}>{message.created}</Moment>
                                            : moment.duration(moment().diff(moment(message.created))).days() < 1
                                                ? <Moment format="h:mm A">{message.created}</Moment>
                                                : <Moment format="MM/DD/YYYY h:mm A">{message.created}</Moment>
                                        }

                                    </IonCardSubtitle>
                                </IonItem>
                            </IonCardHeader>

                            <IonCardContent>{message.content}</IonCardContent>
                        </IonCard>
                    );
                })}
            </IonContent>
            { topic &&
                <IonFooter>
                    <IonToolbar>
                        <form id="sendMessageForm" onSubmit={handleSubmit(sendMessage)}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="10">
                                        <IonCard id="messageBox">
                                            <IonInput name="content" ref={register({ required: true })} />
                                        </IonCard>
                                    </IonCol>
                                    <IonCol className="ion-align-self-center" size="2">
                                        <IonButton expand="block" type="submit">
                                            Send &nbsp;<IonIcon icon={sendOutline}/>
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </form>
                    </IonToolbar>
                </IonFooter>
            }
        </IonPage>
    );
};

export default Topic;
