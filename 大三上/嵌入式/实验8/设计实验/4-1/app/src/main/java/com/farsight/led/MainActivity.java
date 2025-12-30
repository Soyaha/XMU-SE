package com.farsight.led;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import com.farsight.led.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity 
{
    LED led = new LED();
    boolean IsLight_1_On = false;
    boolean IsLight_2_On = false;
    boolean IsLight_3_On = false;
    private ImageButton LedButton_1;
    private ImageButton LedButton_2;
    private ImageButton LedButton_3;

    @Override
    protected void onCreate(Bundle savedInstanceState) 
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        LedButton_1 = (ImageButton)findViewById(R.id.buttonOne);

        LedButton_1.setOnClickListener(new View.OnClickListener() 
        {
            @Override
            public void onClick(View view) 
            {
                if (IsLight_1_On) 
                {
                    ((ImageButton)view).setBackground(getDrawable(R.drawable.pic_bulboff));
                    led.open();
                    led.LedOff1();
                    led.close();
                } 
                else 
                {
                    ((ImageButton)view).setBackground(getDrawable(R.drawable.pic_bulbon));
                    led.open();
                    led.LedOn1();
                    led.close();
                }
                IsLight_1_On = !IsLight_1_On;
            }
        });

        LedButton_2 = (ImageButton)findViewById(R.id.buttonTow);

        LedButton_2.setOnClickListener(new View.OnClickListener() 
        {
            @Override
            public void onClick(View view) 
            {
                if (IsLight_2_On) 
                {
                    ((ImageButton)view).setBackground(getDrawable(R.drawable.pic_bulboff));
                    led.open();
                    led.LedOff2();
                    led.close();
                } 
                else 
                {
                    ((ImageButton)view).setBackground(getDrawable(R.drawable.pic_bulbon));
                    led.open();
                    led.LedOn2();
                    led.close();
                }
                IsLight_2_On = !IsLight_2_On;
            }
        });

        LedButton_3 = (ImageButton)findViewById(R.id.buttonThree);

        LedButton_3.setOnClickListener(new View.OnClickListener() 
        {
            @Override
            public void onClick(View view) 
            {
                if (IsLight_3_On) 
                {
                    ((ImageButton)view).setBackground(getDrawable(R.drawable.pic_bulboff));
                    led.open();
                    led.LedOff3();
                    led.close();
                } 
                else 
                {
                    ((ImageButton)view).setBackground(getDrawable(R.drawable.pic_bulbon));
                    led.open();
                    led.LedOn3();
                    led.close();
                }
                IsLight_3_On = !IsLight_3_On;
            }
        });

    }
}