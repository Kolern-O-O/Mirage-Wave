using UnityEngine;

public class Choice_uniq_event : MonoBehaviour
{
    public class EventNames
    {
        public const string TestEvent = "Additional_test_event";
    }
    public void Event_activate(string ID)
    {
        switch (ID)
        {
            case EventNames.TestEvent:
                Debug.Log("Ивент был вызван сторонним скриптом, скорее всего нажатием на кнопку. Программа зависала, тут не хватает строчки, которая будет подгружать следующую сцену, поскольку я хз пока что тут должно быть кроме этого");
                break;
            default:
                break;
        }
    }
}
