using UnityEngine;

public class Object_links : MonoBehaviour
{
    public static Background_loader background_loader;
    public static Text_loader text_loader;

    public void Awake()
    {
        background_loader = GetComponent<Background_loader>();
        text_loader = GetComponent<Text_loader>();
    }
}
