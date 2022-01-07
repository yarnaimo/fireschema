md-magic

FILE=README.md

sed -i.bak -e "s# from '\.\./index.js'# from 'fireschema'#g" $FILE
sed -i.bak -e "s# from '\.\./admin/index.js'# from 'fireschema/admin'#g" $FILE
sed -i.bak -e "s# from '\.\./hooks/index.js'# from 'fireschema/hooks'#g" $FILE
rm $FILE.bak

prettier --write $FILE
