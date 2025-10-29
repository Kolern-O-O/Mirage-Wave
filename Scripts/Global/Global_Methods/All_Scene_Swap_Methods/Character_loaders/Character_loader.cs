using System.Linq;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Audio;
using UnityEngine.UI;

public class Character_loader : MonoBehaviour
{
    public GameObject Character_prefab;
    public Transform Characters_parent_element;
    public GameObject[] Current_Characters = new GameObject[4];
    public GameObject[] New_Characters = new GameObject[4];

    public void Character_swap(string ID)
    {
        New_Characters = new GameObject[4];
        GameObject CurrentChar = null;
        for (byte i = 12; i <= 48; i += 12)
        {
            if (Dictionaries.all_scenes[ID][i] == "")
                break;
            else
            {
                foreach (GameObject character in Current_Characters)
                {
                    if (character != null && character.name == Dictionaries.all_scenes[ID][i])
                    {
                        CurrentChar = character;
                    }
                }
                Vector3 coordinates = new Vector2(float.Parse(Dictionaries.all_scenes[ID][i + 3]), float.Parse(Dictionaries.all_scenes[ID][i + 4]));
                if (CurrentChar == null)
                {
                    CurrentChar = Instantiate(Character_prefab, coordinates, Quaternion.identity, Characters_parent_element);
                    CurrentChar.name = Dictionaries.all_scenes[ID][i];
                    Current_variables.Character_cout++;
                    Object_links.character_spawn_loader.Spawn(CurrentChar, Dictionaries.all_scenes[ID][i + 5], Dictionaries.all_scenes[ID][i + 6]);
                }
                else if (coordinates != CurrentChar.transform.position)
                {
                    Object_links.character_movement_loader.Movement(CurrentChar, Dictionaries.all_scenes[ID][i + 8], Dictionaries.all_scenes[ID][i + 9], coordinates);
                    //CurrentChar.transform.position = coordinates;
                }
                Image char_img = CurrentChar.GetComponent<Image>();
                Sprite new_image = Resources.Load<Sprite>("Tables/Materials/Character_images/" + Dictionaries.all_scenes[ID][i + 1]);
                if (char_img.sprite != Resources.Load<Sprite>("Tables/Materials/Character_images/" + Dictionaries.all_scenes[ID][i + 1]))
                    Object_links.character_image_loader.Change_image(char_img, new_image, Dictionaries.all_scenes[ID][i + 2]);
                if (!CurrentChar.activeSelf)
                    CurrentChar.SetActive(true);
                Object_links.character_idle_loader.Idle(CurrentChar, Dictionaries.all_scenes[ID][i + 7]);

                New_Characters[(i - 12) / 12] = CurrentChar;


            }
        }
        for (byte i = 0; i < 1; i++)
        {
            if (Current_Characters[i] == null)
                continue;
            byte num = 0;
            for (byte j = 0; j < 4; j++)
            {
                if (New_Characters[j] == null)
                {
                    num++;
                    continue;
                }
                if (Current_Characters[i] != New_Characters[j])
                {
                    num++;
                }
            }
            if (num >= 4) 
            {
                Object_links.character_disappear_loader.Disappear(Current_Characters[i], Dictionaries.all_scenes[ID][i + 10], Dictionaries.all_scenes[ID][i + 11]);
                Current_Characters[i] = null;
            }
            
        }

        Current_Characters = new GameObject[4];
        byte start_num = 0;
        foreach (GameObject character in New_Characters)
        {
            if (character == null)
                continue;
            for (byte i = start_num; i < 4; i++)
            {
                if (Current_Characters[i] == null)
                {
                    start_num++;
                    Current_Characters[i] = character;
                    break;
                }
            }
        }
        Current_variables.Character_is_load = true;
    }
}
