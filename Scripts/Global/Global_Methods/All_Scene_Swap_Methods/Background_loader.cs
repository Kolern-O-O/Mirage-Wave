using UnityEngine;
using UnityEngine.UI;

public class Background_loader : MonoBehaviour
{
    public Image background_object;
    public void Background_swap(string ID)
    {
        background_object.sprite = Resources.Load<Sprite>("Tables/Materials/Backgrounds/" + ID);
    }
}
