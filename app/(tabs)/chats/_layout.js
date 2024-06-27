import { Stack } from "expo-router";

export default function Layout(){
    return(
        <>
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name='chatRoom'/>
            <Stack.Screen name='index'/>
            <Stack.Screen name='profileInfo'/>
        </Stack>
        </>
    )
}