 for i in `ls`;do

if [ -d "$i" ]; then

       cd $i
	
       if [ -d "node_modules" ]; then


 echo " node modules found in $PWD"

	       rm -rf node_modules;

	       
 echo " node modules deleted from $PWD"


	fi
 cd ..	
fi





 done



