using System.Collections;
using TMPro;
using UnityEngine;

public class Text_loader : MonoBehaviour
{
    public TextMeshProUGUI text_object;

    enum Effect_names
    {
        
    }
    public void Text_swap(string text, string Effect_name)
    {
        Text_effect(text, Effect_name);
    }

    public void Text_effect(string text, string Effect_name)
    {
        switch (Effect_name)
        {
            default:
                StartCoroutine(Default(text));
                break;
        }
    }

    IEnumerator Default(string text)
    {
        int current_letter = 0;
        text_object.text = "";
        while (current_letter < text.Length)
        {
            if (Current_variables.Click_to_skip)
            {
                text_object.text = text;
                break;
            }
            text_object.text += text[current_letter];
            current_letter++;
            yield return new WaitForSeconds(Current_variables.text_speed * 0.1f);
        }
        yield return null;
        while (Current_variables.Active_Animation_count > 0)
            yield return null;
        Current_variables.End_scene = true;
    }
}
