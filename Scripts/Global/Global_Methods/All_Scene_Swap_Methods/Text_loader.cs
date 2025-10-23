using TMPro;
using UnityEngine;

public class Text_loader : MonoBehaviour
{
    public TextMeshProUGUI text_object;
    public void Text_swap(string text)
    {
        text_object.text = text;
    }
}
