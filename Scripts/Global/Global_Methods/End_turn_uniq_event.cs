using UnityEngine;

public class End_turn_uniq_event : MonoBehaviour
{
    public class EventNames 
    {
        //public const string TestEvent = "ID_TestScene_01";
    }
    public bool Event_activate(string ID)
    {
        switch (ID)
        {
            //Пример ивента:
            /*case EventNames.TestEvent:
                Debug.Log("Это первая тестовая сцена. Вызваная через ее уникальный ивент в конце хода");
                return true;
                break;*/
            default:
                return false;
        }
    }
}
