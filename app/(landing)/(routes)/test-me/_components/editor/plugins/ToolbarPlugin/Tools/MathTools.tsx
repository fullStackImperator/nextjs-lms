"use client"
import { LexicalEditor, } from "lexical";
import { MathNode } from "../../../nodes/MathNode";
import { useCallback, useEffect, useRef, useState } from "react";
import { $getNodeStyleValueForProperty, $patchStyle } from "../../../nodes/utils";
import ColorPicker from "./ColorPicker";
import type { MathfieldElement } from "mathlive";
import useFixedBodyScroll from "../../../../hooks/useFixedBodyScroll";
import { SxProps, Theme } from '@mui/material/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, SelectChangeEvent, SvgIcon, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Delete, Edit, Menu } from "@mui/icons-material";

const WolframIcon = () => <SvgIcon viewBox='0 0 20 20' fontSize='small'>
  <path d="M15.33 10l2.17-2.47-3.19-.71.33-3.29-3 1.33L10 2 8.35 4.86l-3-1.33.32 3.29-3.17.71L4.67 10 2.5 12.47l3.19.71-.33 3.29 3-1.33L10 18l1.65-2.86 3 1.33-.32-3.29 3.19-.71zm-2.83 1.5h-5v-1h5zm0-2h-5v-1h5z" fill="#f96932"></path>
</SvgIcon>;

export default function MathTools({ editor, node, sx }: { editor: LexicalEditor, node: MathNode, sx?: SxProps<Theme> | undefined }) {
  const [fontSize, setFontSize] = useState('15px');
  const FONT_SIZE_OPTIONS: [string, string][] = [
    ['10px', '10'],
    ['11px', '11'],
    ['12px', '12'],
    ['13px', '13'],
    ['14px', '14'],
    ['15px', '15'],
    ['16px', '16'],
    ['17px', '17'],
    ['18px', '18'],
    ['19px', '19'],
    ['20px', '20'],
  ];

  useEffect(() => {
    editor.getEditorState().read(() => {
      const fontSize = $getNodeStyleValueForProperty(node, 'font-size', '15px');
      setFontSize(fontSize);
    });
  }, [node]);

  const applyStyleMath = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        $patchStyle([node], styles);
      });
    },
    [editor, node],
  );

  const onFontSizeSelect = useCallback(
    (e: SelectChangeEvent) => {
      const fontSize = e.target.value;
      setFontSize(fontSize);
      applyStyleMath({ 'font-size': fontSize });
    },
    [applyStyleMath],
  );

  const onColorChange = useCallback((key: string, value: string) => {
    const styleKey = key === 'text' ? 'color' : 'background-color';
    const mathfield = node.getMathfield();
    if (!mathfield) return;
    if (mathfield.selectionIsCollapsed) {
      applyStyleMath({ [styleKey]: value });
    }
    else {
      const style = key === "text" ? ({ color: value }) : ({ backgroundColor: value });
      const selection = mathfield.selection;
      const range = selection.ranges[0];
      mathfield.applyStyle(style, range);
    }
  }, [applyStyleMath, node]);

  const [open, setOpen] = useState(false);
  const openEditDialog = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = () => {
    setOpen(false);
    restoreSelection();
  };
  const restoreSelection = () => {
    const mathfield = node.getMathfield();
    if (!mathfield) return;
    setTimeout(() => {
      mathfield.focus();
      const mathVirtualKeyboard = window.mathVirtualKeyboard;
      mathVirtualKeyboard.show({ animate: true });
    }, 0);
  }

  const mathfieldRef = useRef<MathfieldElement>(null);
  const [formData, setFormData] = useState({ value: node.getValue() });
  useEffect(() => {
    setFormData({ value: node.getValue() });
  }, [node]);

  const updateFormData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (mathfieldRef.current) {
      mathfieldRef.current.setValue(e.target.value);
    }
  }, [formData]);
  const handleEdit = useCallback((e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { value } = formData;
    const mathfield = node.getMathfield();
    if (!mathfield) return;
    mathfield.setValue(value, { selectionMode: 'after' });
    handleClose();
  }, [editor, formData, handleClose, node]);

  const openWolfram = useCallback(() => {
    const mathfield = node.getMathfield();
    if (!mathfield) return;
    const selection = mathfield.selection;
    const value = mathfield.getValue(selection, 'latex-unstyled') || mathfield.getValue('latex-unstyled');
    window.open(`https://www.wolframalpha.com/input?i=${encodeURIComponent(value)}`);
  }, [node]);

  useFixedBodyScroll(open);

  return (<>
    <ToggleButtonGroup size="small" sx={{ ...sx }} >
      <ToggleButton value="wolfram" onClick={openWolfram}>
        <WolframIcon />
      </ToggleButton>
      <ToggleButton value="edit" onClick={openEditDialog}>
        <Edit />
      </ToggleButton>
      <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ '& .MuiDialog-paper': { width: '100%' } }}>
        <form onSubmit={handleEdit}>
          <DialogTitle>Edit LaTeX</DialogTitle>
          <DialogContent >
            <TextField margin="normal" size="small" fullWidth multiline id="value" value={formData.value} onChange={updateFormData} label="Latex Value" name="value" autoFocus />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="button" component="h3" color="text.secondary" sx={{ my: 1 }}>
                Preview
              </Typography>
              <math-field ref={mathfieldRef} value={formData.value} style={{ width: "auto", margin: "0 auto" }} read-only></math-field>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit' onClick={handleEdit}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ColorPicker onColorChange={onColorChange} onClose={handleClose} />
      <ToggleButton value="delete"
        onClick={() => {
          editor.update(() => {
            node.selectPrevious();
            node.remove();
          });
        }}>
        <Delete />
      </ToggleButton>
      <ToggleButton value="menu"
        onClick={(e) => {
          const mathfield = node.getMathfield();
          const x = e.currentTarget.getBoundingClientRect().left;
          const y = e.currentTarget.getBoundingClientRect().top + 40;
          if (mathfield) mathfield.showMenu({ location: { x, y }, modifiers: { alt: false, control: false, shift: false, meta: false } });
        }}>
        <Menu />
      </ToggleButton>
    </ToggleButtonGroup>
    <Select size='small' onChange={onFontSizeSelect} value={fontSize}>
      {FONT_SIZE_OPTIONS.map(([option, text]) => <MenuItem key={option} value={option}>{text}</MenuItem>)}
    </Select>
  </>
  )

}